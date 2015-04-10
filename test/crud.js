/* globals describe, it, before, beforeEach */
'use strict';

var Sequelize = require('sequelize');
var Q = require('q');
var chai = require('chai');
var expect = chai.expect;

describe(':::: Crud Test ::::', function () {
  var sequelize;

  before(function () {
    sequelize = require('./supports/start').before(sequelize);
  });

  beforeEach(function (done) {
    require('./supports/start').beforeEach(sequelize, done);
  });

  it('Can create', function (done) {
    var Address = sequelize.model('Address', {});
    var crud = require('../lib/sequelizeCRUD')(Address);
    var address = require('./supports/address-sample');

    Q.when(crud.create(address, null))
      .then(function () {
        return Address.findAndCountAll();
      })
      .then(function (res) {
        expect(res.count).equal(1);
      })
      .catch(function (err) {
        throw err;
      })
      .nodeify(done);
  });

  it('Can destroy', function (done) {
    var Address = sequelize.model('Address', {});
    var crud = require('../lib/sequelizeCRUD')(Address);
    var address = require('./supports/address-sample');

    Q.when(crud.create(address))
      .then(function (res) {
        return crud.destroy(address.id, null);
      })
      .then(function () {
        return Address.findAndCountAll();
      })
      .then(function (res) {
        expect(res.count).equal(1);
      })
      .catch(function (err) {
        throw err;
      })
      .nodeify(done);
  });

  it('Can destroy one', function (done) {
    var Address = sequelize.model('Address', {});
    var crud = require('../lib/sequelizeCRUD')(Address);
    var address = require('./supports/address-sample');

    Q.when(crud.create(address, null))
      .then(function () {
        return crud.destroy([0], null);
      })
      .then(function () {
        return Address.findAndCountAll();
      })
      .then(function (res) {
        expect(res.count).equal(0);
      })
      .catch(function (err) {
        throw err;
      })
      .nodeify(done);
  });
});
