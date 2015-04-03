

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Address', {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            get: function () {
              return this.getDataValue('id');
            }
          },
          cityName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            get : function () {
              return this.getDataValue('cityName');
            }
          },
          streetName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            get : function () {
              return this.getDataValue('streetName');
            }
          },
          postCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            get: function () {
              return this.getDataValue('postCode');
            }
          }
        });
};
