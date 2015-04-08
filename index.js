'use strict';
var csv = require('csv');
var q = require('q');

var sequelizeCRUD = require('./lib/sequelizeCRUD');

module.exports = function importerFactory (sequelizeDAO) {

  return {
    syncStream: function (stream, done) {
      var data = [];

      stream
        .pipe(csv.parse({
          delimiter: ';',
          auto_parse: true,
          columns: true
        }))
        .pipe(csv.transform(function (record) {

          return {
            id: record.id,
            city: record.region3,
            street: record.street,
            postcode: record.postcode
          }
        }))
        .on('data', function (chunk) {
          data.push(chunk);
        })
        .on('end', function () {
          q.all(sequelizeCRUD(sequelizeDAO, data).createAll())
            .then(function () {
              done();
            }, function (err) {
              done(err);
            });
        });
    }
  };
};
