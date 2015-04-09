'use strict';

module.exports = function sequelizeCRUD (sequelizeDAO) {

  return {
    create: function (data) {
      return sequelizeDAO
              .upsert({
                id: data.id,
                cityName: data.city,
                streetName: data.street,
                postCode: data.postcode
              });
    },
    destroy: function (ids) {
      return sequelizeDAO
              .destroy({
                where: {
                  $not: [
                    { id: ids }
                  ]
                }
              });
    }
  }
};
