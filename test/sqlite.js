/* globals describe, before, beforeEach, it */
'use strict';

var Sequelize = require('sequelize');
var config = require('./supports/config');
var Q = require('q');
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var importFactory = require('../index');

describe(':::: Sqlite3 DB ::::', function () {
  var dbPath = path.join(__dirname, '../.tmp/test-postcode.sqlite');

  require('./supports/test-import')({
    // Can not test "updatePopulated" cause to `updateOnDuplicate` is only
    // supported by mysql & mariadb
    updatePopulated: false,
    createSequelize: function () {
      return new Sequelize(
        config.database,
        null,
        null,
        {
          dialect: 'sqlite',
          storage: dbPath,
          logging: false
        }
      );
    },
    beforeEach: function () {
      if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath));
      }

      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
    }
  });
});
