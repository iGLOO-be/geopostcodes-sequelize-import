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

  /**
   * Test one Address creation
   * Expect final count of Address to be 1
   */

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

  /**
   * Test destroy unused Address
   * This add a fake Address and destroy all other which doesn't fit address id
   * Expect final count of Address to be 1
   */

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

  /**
   * Test destroy one Address
   * This add a fake Address and destroy Address which id is not 0
   * Expect final count of Address to be 0
   */

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
