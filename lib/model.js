 'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Address', {
    id: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false
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
      type: DataTypes.STRING(10),
      allowNull: false
    }
  });
};
