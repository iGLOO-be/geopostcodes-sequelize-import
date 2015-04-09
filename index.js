'use strict';
var csv = require('csv');
var q = require('q');

var sequelizeCRUD = require('./lib/sequelizeCRUD');

module.exports = function importerFactory (sequelize) {

  var sequelizeDAO = sequelize.model('Address', {});

  return {
    syncStream: function (stream, done) {
      var promises = [];
      var crud = sequelizeCRUD(sequelizeDAO);
      var ids = [];

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
              city: record.region3,
              street: record.street,
              postcode: record.postcode
            }
          }))
          .on('data', function (chunk) {
            ids.push(chunk.id);
            promises.push(crud.create(chunk, { transaction: t }));
          })
          .on('end', function () {
            promises.push(crud.destroy(ids, { transaction: t }));

            q.all(promises)
              .then(function () {
                return t.commit();
              })
              .catch(function (err) {
                return t.rollback()
                  .then(function () {
                    throw err;
                  });
              })
              .nodeify(done);
          });
      });
    }
  };
};
