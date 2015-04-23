/* globals describe, before, beforeEach, it */
'use strict';

var Sequelize = require('sequelize');
var config = require('./supports/config');
var Q = require('q');
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

describe(':::: Sqlite3 DB ::::', function () {
  var sequelize;

  before(function () {
    sequelize = new Sequelize(
      config.database,
      null,
      null,
      {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../db/postcode.sqlite'),
        logging: true
      }
    );

    sequelize.import(path.join(__dirname, '../lib/model'));
  });

  beforeEach(function (done) {
    sequelize
      .sync({ force: true })
      .nodeify(done);
  });

  it('Can create one', function (done) {
    var Address = sequelize.model('Address', {});

    Address
      .bulkCreate([{
        id: 20001548796,
        cityName: 'Bruxelles',
        streetName: 'Grand Rue',
        postCode: 1070
      }, {
        id: 21546987456,
        cityName: 'Anvers',
        streetName: 'Konijn',
        postCode: 4852
      }])
      .then(function () {
        return Address.count();
      })
      .then(function (count) {
        expect(count).equal(2);
      })
      .catch(function (err) {
        throw err;
      })
      .nodeify(done);
  });

  it('Can import light', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize);
    var Address = sequelize.model('Address', {});
    var sync = Q.nbind(importer.syncStream, importer);

    sync(
      fs.createReadStream(path.join(__dirname, '/fixtures/csv/light.csv'))
    )
    .then(function () {
      return Address.count();
    })
    .then(function (count) {
      expect(count).equal(3);
    })
    .catch(function (err) {
      throw err;
    })
    .nodeify(done);
  });

  it('Can import loud', function (done) {
    this.timeout(2000 * 100);
    var factory = require('../index');
    var importer = factory(sequelize);
    var Address = sequelize.model('Address', {});
    var sync = Q.nbind(importer.syncStream, importer);

    sync(
      fs.createReadStream(path.join(__dirname, '/fixtures/csv/sample.csv'))
    )
    .then(function () {
      return Address.count();
    })
    .then(function (count) {
      expect(count).equal(149999);
    })
    .catch(function (err) {
      throw err;
    })
    .nodeify(done);
  });
});
