# geoposition-import

Module for importing geopostcodes from csv files and put them into database.
The csv file convention can be retrieve here : [geopostcode](http://www.geopostcodes.com/?lang=fr)

## Installation

This module is installed via npm:

``` bash
$ npm install geoposition-import
```

## Example Usage

``` js
var Sequelize = require('sequelize');
var geopositionImport = require('geoposition-import');

var sequelize = new Sequelize(databse, user, password);

  // Some code here

function doSomething (done) {
  var model = require('path/to/model');
  var importer = geopositionImport(model);
  var stream = fs.createReadStream('path/to/csv');

  importer.syncStream(stream, done);
}

```
