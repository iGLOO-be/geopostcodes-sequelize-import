

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Address', {
          cityName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            get : function () {
              return this.getDataValue('cityName');
            },
          },
          streetName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            get : function () {
              return this.getDataValue('street');
            },
          },
          streetNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            get: function () {
              return this.getDataValue('number');
            }
          }
        });
};
