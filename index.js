'use strict';
var csv = require('csv');
var q = require('q');
var async = require('async');
var merge = require('lodash/object/merge');

var sequelizeCRUD = require('./lib/sequelizeCRUD');

module.exports = function importerFactory (sequelize, options) {

  var sequelizeDAO = sequelize.model('Address', {});

  options = merge({
    maxBulkCreate: 1000
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
      var promises = [];
      var crud = sequelizeCRUD(sequelizeDAO);
      var ids = [];

      var cargo = async.cargo(function (datas, done) {
        var options = datas[0].transaction;
        var records = datas.map(function (d) { return d.record });

        options.updateOnDuplicate = true;

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
            return {
              id: record.id,
              cityName: record.region3,
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
