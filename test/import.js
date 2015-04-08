/* globals describe, before, beforeEach, it */
'use strict';
var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var config = require('./fixtures/config');

describe(':::: Import Factory ::::', function () {
  var sequelize;

  before(function () {
    sequelize = new Sequelize(
      config.database,
      config.user,
      config.password
    );

    sequelize.import(path.join(__dirname, '../lib/model'));
  });

  beforeEach(function (done) {
    sequelize
      .sync({ force: true })
      .nodeify(done);
  });

  it('Can create importer', function () {
    var factory = require('../index');
    var importer = factory(sequelize.model('Address'), {});

    expect(importer.syncStream).to.be.a('function');
  });

  it('Can do import', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize.model('Address'), {});
    var Address = sequelize.model('Address', {});

    _create(Address)
      .then(function () {
        importer.syncStream(
          fs.createReadStream(path.join(__dirname, '/fixtures/csv/sample.csv')),
          done
        );
      }, function (err) {
        done(err);
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
