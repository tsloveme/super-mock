
global._ENV = 'development';
const defaultPort = 3600;
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const app = express()
const config = require('./webpack.config.dev');
const { getFreePort, getIPAddress } = require('./utils');
const IPAddress = getIPAddress();
config.entry.main.unshift ('webpack-hot-middleware/client');
const SuperMock = require('../lib');
app.use('/api', (req,res,next)=>{
  res.send(req.path);
})
// app.use(SuperMock)
const compiler = webpack(config);
getFreePort(defaultPort, defaultPort + 20).then(async (port) => {
  console.log(`${port} can used!`)
  if (defaultPort !== port) {
    console.log('****************************');
    console.log(`the port: ${defaultPort} is in used!!!`);
    console.log(`use port: ${port} instead!!!`);
    console.log('****************************');
    await new Promise(resolove=>setTimeout(resolve, 3000));
  }
  SuperMock.install(app);
  app.get('/', function(req, res, next){
    res.redirect('/devTool');
  })
  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler,{
    publicPath: `/devTool`,
    // publicPath: `${IPAddress}:${port}/`,
    stats:{
      colors:true,
      chunks: false
    }
  }));
  
  // app.use(require("webpack-hot-middleware")(compiler));
  // compiler.plugin('compilation', function (compilation) {
  //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
  //     hotMiddleware.publish({ action: 'reload' })
  //     cb()
  //   })
  // })
  app.listen(port, function (err) {
    if (err) {
      console.log(err)
      return
    }
    const serUrl = `${IPAddress}:${port}/`;
    console.log(`Listening at ${serUrl} \n`);
    console.log(`服务器已经启动: ${serUrl} \n`);
  })
})
.catch(err=>{
  console.log(err);
})

