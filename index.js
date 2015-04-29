'use strict';

var csv = require('csv');
var Q = require('q');
var async = require('async');
var merge = require('lodash/object/merge');
var path = require('path');

var csvParseOptions = {
  delimiter: ';',
  auto_parse: true,
  columns: true
};

module.exports = function importerFactory (sequelize, options) {
  sequelize.import(path.join(__dirname, 'lib/model'));
  var AddressDAO = sequelize.model('Address', {});

  options = merge({
    maxBulkCreate: 500,

    // Does not work on SQLLite
    updateOnDuplicate: false
  }, options);

  return {
    /**
     * syncStream()
     *
     * @params {Stream} stream | Stream which contains csv content
     * @params {Callback} done
     */
    syncStream: function (stream, done) {
      var promises = [];
      var ids = [];
      var defer = Q.defer();

      // Async cargo does not care about errors!
      var error = null;
      var cargo = async.cargo(function (datas, done) {
        // Ignore processing if an error appear
        if (error) {
          return done();
        }

        var transaction = datas[0].transaction;
        var records = datas.map(function (d) { return d.record; });

        AddressDAO.bulkCreate(records, {
          updateOnDuplicate: options.updateOnDuplicate,
          transaction: transaction,
          validate: true
        })
          .catch(function (err) {
            error = err;
          })
          .then(done);
      }, options.maxBulkCreate);

      sequelize.transaction()
        .then(function (t) {
          stream
            .pipe(csv.parse(csvParseOptions))
            .pipe(csv.transform(function (record) {
              return {
                id: record.language + '-' + record.id,
                language: record.language,
                cityName: record.locality,
                streetName: record.street,
                postCode: record.postcode
              };
            }))
            .on('data', function (record) {
              if (record) {
                ids.push(record.id);
                cargo.push({ record: record, transaction: t });
              }
            })
            .on('end', function () {
              var end = function () {
                if (error) {
                  return t
                    .rollback()
                    .catch(defer.reject.bind(defer))
                    .then(function () {
                      defer.reject(error);
                    });
                }

                promise = AddressDAO
                  .destroy({
                    where: {
                      $not: [
                        { id: ids }
                      ]
                    },
                    transaction: t
                  })
                  .then(t.commit.bind(t))

                defer.resolve(promise);
              };

              if (cargo.length()) {
                cargo.drain = end;
              } else {
                end();
              }
            });
        });

      if (done) {
        defer.promise.nodeify(done);
      }

      return defer.promise;
    }
  };
};
