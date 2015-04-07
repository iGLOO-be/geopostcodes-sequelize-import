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
        .on('data', function (chunk) {
          data.push(chunk);
        })
        .on('end', function () {
          q.all(_createAll(sequelizeDAO, data))
            .then(function () {
              return done();
            }, function (err) {
              return done(err);
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
  _deleteUnused(sequelizeDAO, jsonArray);

  return promises;
};

var _deleteUnused = function (sequelizeDAO, jsonArray) {
  var id = [];

  jsonArray
    .forEach(function (address) {
      id.push(address.id);
    });

  return sequelizeDAO
          .destroy({
            where: {
              $not: [
                { id: id }
              ]
            }
          });
};
