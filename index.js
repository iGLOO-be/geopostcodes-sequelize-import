'use strict';
var csv = require('csv');
var q = require('q');
var async = require('async');
var merge = require('lodash/object/merge');
var path = require('path');

var sequelizeCRUD = require('./lib/sequelizeCRUD');

module.exports = function importerFactory (sequelize, options) {

  sequelize.import(path.join(__dirname, 'lib/model'));
  var sequelizeDAO = sequelize.model('Address', {});

  options = merge({
    maxBulkCreate: 500,

    // Does not work on SQLLite
    updateOnDuplicate: false
  }, options);

  return {
    /**
     * syncStream() trig a promise
     * based on the correct execution a transaction
     *
     * @params {Stream} stream | Stream which contains csv content
     * @params {Promise} done | The promise to resolve
     */
    syncStream: function (stream, done) {
      sequelize.sync({
        force: true
      });
      var promises = [];
      var crud = sequelizeCRUD(sequelizeDAO);
      var ids = [];

      var cargo = async.cargo(function (datas, done) {
        var options = datas[0].transaction;
        var records = datas.map(function (d) { return d.record });

        sequelizeDAO.bulkCreate(records, options)
          .nodeify(done);
      }, options.maxBulkCreate);

      sequelize.transaction()
      .then(function (t) {
        stream
          .pipe(csv.parse({
            delimiter: ';',
            auto_parse: true,
            columns: true
          }))
          .pipe(csv.transform(function (record) {
            var id = record.language + '-' + record.id
            return {
              id: id,
              language: record.language,
              cityName: record.locality,
              streetName: record.street,
              postCode: record.postcode
            }
          }))
          .on('data', function (chunk) {
            ids.push(chunk.id);
            cargo.push({ record: chunk, transaction: t });
          })
          .on('end', function () {
            var end = function () {
              q.when(
                crud.destroy(ids, { transaction: t })
              )
                .then(t.commit.bind(t))
                .nodeify(done);
            };

            if (cargo.length()) {
              cargo.drain = end;
            } else {
              end()
            }
          });
      });
    }
  };
};
