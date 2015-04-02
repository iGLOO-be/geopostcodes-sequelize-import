

module.exports = function (sequelize, DataTypes) {
  sequelize.define('Address', {
    cityName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    streetName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    streetNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
