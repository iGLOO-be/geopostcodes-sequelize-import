'use strict';

var merge = require('lodash/object/merge');

module.exports = function sequelizeCRUD (sequelizeDAO) {

  return {
    create: function (data, options) {
      return sequelizeDAO
              .upsert({
                id: data.id,
                cityName: data.city,
                streetName: data.street,
                postCode: data.postcode
              }, options);
    },
    destroy: function (ids, options) {
      return sequelizeDAO
              .destroy(merge({
                where: {
                  $not: [
                    { id: ids }
                  ]
                }
              }, options));
    }
  }
};
