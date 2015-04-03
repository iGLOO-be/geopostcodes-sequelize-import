var fs = require('fs');
var path = require('path');

module.exports = function () {
  return fs.createReadStream(path.join(__dirname, '/csv/sample.csv'));
};
