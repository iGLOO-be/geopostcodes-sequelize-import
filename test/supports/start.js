'use strict';

var Sequelize = require('sequelize');
var config = require('./config');
var path = require('path');

module.exports = {
  before: function (sequelize) {
    sequelize = new Sequelize(
      config.database,
      config.user,
      config.password,
      {
        logging: false
      }
    );

    sequelize.import(path.join(__dirname, '../../lib/model'));

    return sequelize;
  },
  beforeEach: function (sequelize, done) {
    return sequelize
            .sync({ force: true })
            .nodeify(done);
  }
};
