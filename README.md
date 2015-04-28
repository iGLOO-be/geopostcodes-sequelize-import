# geopostcodes-sequelize-import

Import [geopostcode.com](http://www.geopostcodes.com/) streets file into SQL database with [Sequelize](https://github.com/sequelize/sequelize).

## Installation

``` bash
$ npm install geopostcodes-sequelize-import
```

## Example Usage

``` js
var fs = require('fs');
var importerFactory = require('geopostcodes-sequelize-import');
var importer = importerFactory(sequelize, {
  // options
});

var csvFilePath = 'path/to/geopostcodes-streets-plus.csv';
var csvStream = fs.createReadStream(csvFilePath);

importer.syncStream(csvStream, function (err) {
  if (err) {
    throw err;
  }
  console.log('Sync end!');
});
```

## Options

- `maxBulkCreate` : (default: `500`) Maximum records processed per `insert into`.
- `updateOnDuplicate` : (default: `false`)
  See [sequelize doc](http://docs.sequelizejs.com/en/latest/api/model/#bulkcreaterecords-options-promisearrayinstance).
  Only supported by `mysql` & `mariadb`
  If `false`, duplicate ID errors can be raised if database is already populated.
