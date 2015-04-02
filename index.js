module.exports = function importerFactory (sequelizeDAO) {
  return {
    syncStream: function (stream, done) {
      done();
    }
  };
};
