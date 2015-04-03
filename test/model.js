var Sequelize  = require('sequelize');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var config = require('./config/config');

describe(':::: Value Query ::::', function () {
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
      .sync({force: true})
      .nodeify(done);
  });


  it('Can create model', function (done) {
    var Address = sequelize.model('Address', {});

    _create(Address)
      .then(function (model) {
        Address
          .findAndCountAll()
          .then(function (result) {
            expect(result.count).equal(1);
            done();
          }, function (err) {
            done(err);
          });
      });
  });

  it('Can get value', function (done) {
    var Address = sequelize.model('Address', {});

    _create(Address)
      .then(function (model) {
        expect(model.get('cityName')).equal('Bruxelles');
        done();
      }, function (err) {
        done(err);
      });

  });
});

var _create = function (model) {
  return model
          .create({
            cityName: 'Bruxelles',
            streetName: 'Grand Rue',
            streetNumber: 3
          });
};
