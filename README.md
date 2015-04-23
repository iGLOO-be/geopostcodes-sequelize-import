# geopostcodes-sequelize-import

Module for importing geopostcodes from csv files and put them into database.
The csv file convention can be retrieve here : [geopostcode.com](http://www.geopostcodes.com/)

## Installation

This module is installed via npm:

``` bash
$ npm install geopostcodes-sequelize-import
```

## Example Usage

``` js
  var fs = require('fs');
  var createImporter = require('geopostcodes-sequelize-import');
  var importer = createImporter(sequelize, {
    // options
  });

  var csvFilePath = 'path/to/geopostcodes-streets-plus.csv';
  var csvStream = fs.createReadStream(csvFilePath);

  importer.syncStream(csvStream)
    .on('end', function () {
      console.log('Sync end!')
    });
```
