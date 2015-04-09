'use strict';
var csv = require('csv');
var q = require('q');

var sequelizeCRUD = require('./lib/sequelizeCRUD');

module.exports = function importerFactory (sequelizeDAO) {

  return {
    syncStream: function (stream, done) {
      var promises = [];
      var crud = sequelizeCRUD(sequelizeDAO);
      var ids = [];

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
          ids.push(chunk.id);
          promises.push(crud.create(chunk));
        })
        .on('end', function () {
          promises.push(crud.destroy(ids))
          q.all(promises)
            .then(function () {
              done();
            }, function (err) {
              done(err);
            });
        });
    }
  };
};
