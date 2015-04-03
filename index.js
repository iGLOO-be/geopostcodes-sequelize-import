var csv = require('csv');
var q = require('q');

module.exports = function importerFactory (sequelizeDAO) {

  var data = [];

  return {
    syncStream: function (stream, done) {
      stream
        .pipe(csv.parse({
          delimiter: ';',
          auto_parse: true,
          columns: true
        }))
        .pipe(csv.transform(function (record) {
          return record;
        }))
        .on('data', function (chunk) {
          data.push(chunk);
        })
        .on('end', function () {
          q.all(_createAll(sequelizeDAO, data))
            .then(function () {
              done();
            }, function (err) {
              done(err);
            });
        });
    }
  };
};

var _create = function (sequelizeDAO, jsonData) {
  return sequelizeDAO
          .upsert({
            id: jsonData.id,
            cityName: jsonData.region3,
            streetName: jsonData.street,
            postCode: jsonData.postcode
          });
};

var _createAll = function (sequelizeDAO, jsonArray) {
  var promises = [];
  jsonArray
    .forEach(function (address) {
      promises.push(_create(sequelizeDAO, address));
    });
  return promises;
};
