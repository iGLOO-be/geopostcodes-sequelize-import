/* globals describe, it, before, beforeEach */
'use strict';

var Sequelize = require('sequelize');
var chai = require('chai');
var expect = chai.expect;

describe(':::: Memory Testing ::::', function () {
  var sequelize;

  before(function () {
    sequelize = require('./supports/start').before(sequelize);
  });

  beforeEach(function (done) {
    require('./supports/start').beforeEach(sequelize, done);
  });

  it('Overload', function (done) {
    done();
  });
});
