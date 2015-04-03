var Sequelize = require('sequelize');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var testConfig = require('./config/config');
var csvStream = require('./fixtures/csv-stream');

describe(':::: Import Factory ::::', function () {
  var sequelize;

  before(function () {
    sequelize = new Sequelize(
      testConfig.database,
      testConfig.user,
      testConfig.password
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
    importer = factory(sequelize.model('Address'), {});

    expect(importer.syncStream).to.be.a('function');
  });

  it('Can do import', function (done) {
    var factory = require('../index');
    var importer = factory(sequelize.model('Address'), {});
    var Address = sequelize.model('Address', {});

    importer.syncStream(csvStream(), done);
  });
});
