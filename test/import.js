/* globals describe, before, beforeEach, it */
'use strict';
var Sequelize = require('sequelize');
var fs = require('fs');
var Q = require('q');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var config = require('./supports/config');

describe(':::: Import Factory ::::', function () {
  var sequelize;

  before(function () {
    sequelize = require('./supports/start').before(sequelize);
  });

  beforeEach(function (done) {
    require('./supports/start').beforeEach(sequelize, done);
  });

  it('Can create importer', function () {
    var factory = require('../index');
    var importer = factory(sequelize.model('Address'), {});

    expect(importer.syncStream).to.be.a('function');
  });

  it('Can do import', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize.model('Address'), {});
    var sync = Q.nbind(importer.syncStream, importer);
    var Address = sequelize.model('Address', {});

    _create(Address)
      .then(function () {
        return sync(
          fs.createReadStream(path.join(__dirname, '/fixtures/csv/sample.csv'))
        );
      })
      .then(function () {
        return Address.findAndCount()
          .then(function (res) {
            expect(res.count).equal(3); // somes tets
          });
      })
      .then(function () {
        done();
      });
  });
});

var _create = function (model) {

  return model
          .create({
            id: 206351200,
            cityName: 'Bruxelles',
            streetName: 'Grand Rue',
            postCode: 1000
          });
};
