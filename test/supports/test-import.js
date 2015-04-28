/* globals describe, before, beforeEach, it */
'use strict';

var Q = require('q');
var path = require('path');
var fs = require('fs');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);
var expect = chai.expect;

chaiAsPromised.transferPromiseness = function (assertion, promise) {
  assertion.then = promise.then.bind(promise);
  assertion.finally = promise.finally.bind(promise);
  assertion.done = promise.done.bind(promise);
  assertion.nodeify = promise.nodeify.bind(promise);
};

var importFactory = require('../../index');

module.exports = function (options) {
  var sequelize, importer;

  beforeEach(function (done) {
    this.timeout(20000);

    if (options.beforeEach) {
      options.beforeEach();
    }

    if (sequelize) {
      sequelize.close();
      sequelize = null;
    }

    sequelize = options.createSequelize();
    importer = importFactory(sequelize, options.importerOptions);

    sequelize
      .sync({ force: true })
      .nodeify(done);
  });

  function expectAddressCount (expected) {
    return sequelize
      .model('Address', {})
      .count()
      .should.eventually.equal(expected);
  }

  /**
   * Test the creation of geo post code importer
   * Expect importer to have a function syncStream
   */
  it('Can create importer', function () {
    expect(importer.syncStream).to.be.a('function');
  });

  describe('Sync from empty database', function () {

    /**
     * Test Simple import with clean database
     * Expect final count of Address to be 3
     */
    it('Can import light', function (done) {
      var syncStream = Q.nbind(importer.syncStream, importer);

      syncStream(
        fs.createReadStream(path.join(__dirname, '../fixtures/csv/light.csv'))
      )
        .then(expectAddressCount.bind(null, 3))
        .nodeify(done);
    });

    /**
     * Test Loud import with clean database
     * Expect final count of Address to be 4999
     */
    it('Can import loud', function (done) {
      this.timeout(10 * 1000);
      var syncStream = Q.nbind(importer.syncStream, importer);

      syncStream(
        fs.createReadStream(path.join(__dirname, '../fixtures/csv/sample.csv'))
      )
        .then(expectAddressCount.bind(null, 4999))
        .nodeify(done);
    });

    /**
     * Test the importation of wrong csv file
     * Expect sync to throw Error
     */
    it('Can\'t import wrong csv', function (done) {
      var syncStream = Q.nbind(importer.syncStream, importer);

      syncStream(
        fs.createReadStream(path.join(__dirname, '../fixtures/csv/wrong-csv.csv'))
      )
        .should.be.rejected
        .nodeify(done);
    });

    /**
     * Test the importation of non csv file
     * Expect syn to throw Error
     */
    it('Can\'t imports non csv file', function (done) {
      var syncStream = Q.nbind(importer.syncStream, importer);

      syncStream(
        fs.createReadStream(path.join(__dirname, '../fixtures/csv/fake.txt'))
      )
        .should.be.rejected
        .nodeify(done);
    });

  });

  if (options.updatePopulated)
    describe('Sync/update from populated database', function () {
      it('Can do import multiple times', function (done) {
        var syncStream = Q.nbind(importer.syncStream, importer);
        var doIt = function () {
          return syncStream(
            fs.createReadStream(path.join(__dirname, '../fixtures/csv/light.csv'))
          )
            .then(expectAddressCount.bind(null, 3));
        };

        doIt().then(doIt).then(doIt).nodeify(done);
      });

      it('Can do import with new file with 1 record less', function (done) {
        var syncStream = Q.nbind(importer.syncStream, importer);

        syncStream(
          fs.createReadStream(path.join(__dirname, '../fixtures/csv/light.csv'))
        )
          .then(expectAddressCount.bind(null, 3))
          .then(function () {
            return syncStream(
              fs.createReadStream(path.join(__dirname, '../fixtures/csv/light-update.csv'))
            );
          })
          .then(expectAddressCount.bind(null, 2))
          .nodeify(done);
      });
    });

};
