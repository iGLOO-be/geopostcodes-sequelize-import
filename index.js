var csv = require('csv');
var fs = require('fs');

module.exports = function importerFactory (sequelizeDAO) {

  var data = [];

  return {
    syncStream: function (stream, done) {
      stream
        .pipe(csv.parse({delimiter: ';', auto_parse: true, columns: true}))
        .pipe(csv.transform(function (record) {
          return data.push(record);
        }))
        .pipe(fs.createWriteStream('test.json'));
      done();
    }
  };
};
