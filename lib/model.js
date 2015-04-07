

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Address', {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            get: function () {
              return this.getDataValue('id');
            }
          },
          cityName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'city_name',
            get : function () {
              return this.getDataValue('cityName');
            }
          },
          streetName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'street_name',
            get : function () {
              return this.getDataValue('streetName');
            }
          },
          postCode: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'post_code',
            get: function () {
              return this.getDataValue('postCode');
            }
          }
        });
};
