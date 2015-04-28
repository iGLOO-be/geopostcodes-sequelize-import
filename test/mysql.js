/* globals describe, before, beforeEach, it */
'use strict';
var Sequelize = require('sequelize');
var fs = require('fs');
var Q = require('q');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

describe(':::: MySQL ::::', function () {
  var sequelize;

  require('./supports/test-import')({
    updatePopulated: true,
    importerOptions: {
      updateOnDuplicate: true
    },
    createSequelize: function () {
      return new Sequelize(
        'geopostcodes-sequelize-import',
        'root',
        '',
        {
          logging: false
        }
      );
    }
  });
});
