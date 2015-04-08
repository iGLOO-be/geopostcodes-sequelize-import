'use strict';

module.exports = function sequelizeCRUD (sequelizeDAO, jsonArray) {

  return {
    createAll: function () {
      var promises = [];

      jsonArray
        .forEach(function (address) {
          promises.push(create(sequelizeDAO, address));
        });
      destroy(sequelizeDAO, jsonArray);

      return promises;
    }
  }
};

function create (sequelizeDAO, jsonData) {

  return sequelizeDAO
          .upsert({
            id: jsonData.id,
            cityName: jsonData.city,
            streetName: jsonData.street,
            postCode: jsonData.postcode
          });
};

function destroy (sequelizeDAO, jsonArray) {
  var id = [];

  jsonArray
    .forEach(function (address) {
      id.push(address.id);
    });

  return sequelizeDAO
          .destroy({
            where: {
              $not: [
                { id: id }
              ]
            }
          });
};
