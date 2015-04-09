'use strict';

var merge = require('lodash/object/merge');

module.exports = function sequelizeCRUD (sequelizeDAO) {

  return {
    create: function (data, options) {
      return sequelizeDAO
              .upsert(data, options);
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
