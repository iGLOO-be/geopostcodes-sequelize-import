var Sequelize  = require('sequelize');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var config = require('./config/config');

describe(':::: Model Testing ::::', function () {
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
        expect(model.get('id')).equal(20003562);
        expect(model.get('cityName')).equal('Bruxelles');
        expect(model.get('streetName')).equal('Grand Rue');
        expect(model.get('postCode')).equal(1000);
        done();
      }, function (err) {
        done(err);
      });
  });

  it('Can delete model', function (done) {
    var Address = sequelize.model('Address', {});

    _create(Address)
      .then(function(model) {
        Address.destroy({
          where: {
            cityName: 'Bruxelles'
          }
        })
        .then(function () {
          Address
            .findAndCountAll()
            .then(function (result) {
              expect(result.count).equal(0);
              done();
            }, function (err) {
              done(err);
            });
        }, function (err) {
          done(err);
        });
      }, function (err) {
        done(err);
      });
  });
});

var _create = function (model) {
  return model
          .create({
            id: 20003562,
            cityName: 'Bruxelles',
            streetName: 'Grand Rue',
            postCode: 1000
          });
};
