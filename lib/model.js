 'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Address', {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
          },
          cityName: {
            type: DataTypes.STRING(100),
            allowNull: false
          },
          streetName: {
            type: DataTypes.STRING(100),
            allowNull: false
          },
          postCode: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
        });
};
