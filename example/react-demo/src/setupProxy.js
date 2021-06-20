
// const SupperMock = require('../../../lib'); // my local project test
const SupperMock = require('super-mock-middleware');

module.exports = function (app) {
  SupperMock.install(app);
}