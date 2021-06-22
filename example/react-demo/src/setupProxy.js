
// const SuperMock = require('../../../lib'); // my local project test
const SuperMock = require('super-mock-middleware');

module.exports = function (app) {
  SuperMock.install(app);
}