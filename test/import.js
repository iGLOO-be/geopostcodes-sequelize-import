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

  /**
   * Test the creation of geo post code importer
   * Expect importer to have a function syncStream
   */

  it('Can create importer', function () {
    var factory = require('../index');
    var importer = factory(sequelize);

    expect(importer.syncStream).to.be.a('function');
  });

  /**
   * Test Simple import with clean database
   * Expect final count of Address to be 3
   */

  it('Can do import', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize);
    var sync = Q.nbind(importer.syncStream, importer);
    var Address = sequelize.model('Address', {});

  sync(
    fs.createReadStream(path.join(__dirname, './fixtures/csv/sample.csv'))
  )
    .then(function () {
      return Address.findAndCountAll();
    })
    .then(function (res) {
      expect(res.count).equal(3);
    })
    .catch(function (err) {
      throw err;
    })
    .nodeify(done);
  });

  /**
   * Test the importation of csv file while other Address already exist
   * Expect final count of Address to be 3
   */

  it('Can do import and destroy', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize);
    var sync = Q.nbind(importer.syncStream, importer);
    var Address = sequelize.model('Address', {});

    Q.when(_create(Address))
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
      .nodeify(done);
  });

  /**
   * Test the importation of wrong csv file
   * Expect sync to throw Error
   */

  it('Can\'t import wrong csv', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize);
    var sync = Q.nbind(importer.syncStream, importer);
    var Address = sequelize.model('Address', {});

    sync(
      fs.createReadStream(path.join(__dirname, './fixtures/csv/wrong-csv.csv'))
    )
    .then(function () {
      throw new Error('Should not pass');
    })
    .catch(function (err) {

    })
    .nodeify(done);
  });

  /**
   * Test the importation of non csv file
   * Expect syn to throw Error
   */

  it('Can\'t imports non csv file', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize);
    var sync = Q.nbind(importer.syncStream, importer);
    var Address = sequelize.model('Address', {});

    sync(
      fs.createReadStream(path.join(__dirname, './fixtures/csv/fake.txt'))
    )
    .then(function () {
      throw new Error('Should not pass');
    })
    .catch(function (err) {

    })
    .nodeify(done);
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
