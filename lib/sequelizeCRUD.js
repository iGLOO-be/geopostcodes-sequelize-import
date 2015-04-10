'use strict';

var merge = require('lodash/object/merge');

module.exports = function sequelizeCRUD (sequelizeDAO) {

  return {
    /**
     * create() return a promise
     * based on the creation of a new sequelize entry
     *
     * @params {Object} data
     * @params {Object} options
     * @return {Promise} sequelize.create()
     */
    create: function (data, options) {
      return sequelizeDAO
              .upsert(data, options);
    },
    /**
     * destroy() retrun a promise
     * based on the deletation of id not present in ids
     *
     * @params {Array} ids | The ids of objects which will not be destroyed
     * @params {Object} options | Usually the transaction
     * @return {Promise} sequelize.destroy()
     */
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
