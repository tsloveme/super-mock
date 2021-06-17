// const { proxy } = require('http-proxy-middleware')
// 或
const path = require('path');
const proxy = require('http-proxy-middleware');
const SupperMock = require('../../../lib');

module.exports = function (app) {
  SupperMock.install(app);
  app.use(proxy('/devTool', {
    target: 'http://127.0.0.1:3600',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/"
    }
  }));
  app.use(proxy('/api', {
    target: 'http://127.0.0.1:3600',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/"
    }
  }))
}