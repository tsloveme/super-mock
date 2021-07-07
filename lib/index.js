/**
 * devTools entry
 * Created Date: Tuesday May 25th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Tuesday May 25th 2021 5:34:50 pm
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */



const fs = require('fs');
const fse = require('fs-extra');
const path = require("path");
const Express = require('express');
const http = require('http');
const https = require('https');
const sockjs = require('sockjs');
const bodyParser = require('body-parser');
const { makeRange } = require('./helpers/getPort');
const proxyModel = require('./helpers/proxyModel');
const mockMid = require('./helpers/mockMid');
const { readEnvFromCache } = require('./helpers/envModel');
const httpsOption = {
  key: fs.readFileSync(path.join(__dirname, './keys/key.pem'), {encoding: 'utf-8'}),
  cert: fs.readFileSync(path.join(__dirname, './keys/cert.pem'), {encoding: 'utf-8'}),
};
const appSock = Express();
const sockService = sockjs.createServer({prefix: '/env-ws'});
global.__envVar = global.__envVar || {};
Object.assign(global.__envVar, readEnvFromCache())

const sockClients = [];
global.sockClients = sockClients;
sockService.on('connection', function(conn) {
  sockClients.push(conn);
  conn.on('data', function(message) {
    console.log('receive msg:', message)
    conn.write(message);
  });
  conn.on('close', function() {});
});

// 拿到可用的两个端口，用于http\https服务器
Promise.all([
  makeRange(10000, 10100),
  makeRange(10000, 10100)
]).then(([wsPort, wssPort])=>{
  Object.assign(global.__envVar, {wsPort, wssPort });
  let httpServerSock = http.createServer(appSock);
  let httpsServerSock = https.createServer(httpsOption, appSock);
  sockService.installHandlers(httpServerSock);
  sockService.installHandlers(httpsServerSock);
  /**启动ws服务器**/
  httpServerSock.listen(wsPort, function(err){
    if (err) {
      console.warn('devTools ws 服务启动失败！');
    } {
      console.log(`devTools ws 启动成功: ws://127.0.0.1:${wsPort}`);
    }
  })
  /**启动wss服务器**/
  httpsServerSock.listen(wssPort, function(err){
    if (err) {
      console.warn('devTools wss 服务启动失败！');
    } {
      console.log(`devTools wss 启动成功: wss://127.0.0.1:${wssPort}`);

    }
  })
})
// the default option
const defaultOption = {
  /**
   * then mock data path
   * default: relative path 'mock' of you script start path;
   * you could pass a absolute path.
   */
  mockPath: path.resolve(process.cwd(), 'mock'),
  /**
   * use to cache you setting about mock toggle/proxy rule and other data of the middleware
   * you can copy it to other computer to share you local config.
   */
  cachePath: path.resolve(process.cwd(), 'cache'),
  /**
   * global delay of your mock api data.
   */
  delay: 30,
  /**
   * by true, when run the middleware fist time, it copy the demo mock file to you mock path.
   * it won't overwite when the mock file exits;
   */
  copyDemo: true,
}

module.exports.install = function(app, option ={}) {
  finalOpt = Object.assign({}, defaultOption, option);

  if (finalOpt.copyDemo) {
    let source = path.resolve(__dirname, '../mock');
    let target = finalOpt.mockPath;
    if (source !== target) {
      console.log(`copy sample mock file to ${target}`);
      fse.copySync(source, target, {recursive: true, overwrite: false});
    }
  }
  /** 动态代理相关 */
  app.use(proxyModel.handleTryProxy); //尝试代理接口（本地内建服务器模拟）
  app.use(proxyModel.proxyRemoteService); //代理数据接口至动态代理、
  /**
   * mock数据的无缝切换
   * 可以写生产、环境上的路径 (/开头, 非域名开头) 在前端页面开关启用
   * switch the mock data between then remote backend service
   */
   app.use(function(req, res, next){
    // 匹配接口路由
    // let proxyPaths = require('./config').proxyPaths;
    // let isMatchPalubaoApiPath = proxyPaths.find(item => {
    //   return req.path.indexOf(item) == 0;
    // });
    // let isMatchMockApiPath = req.path.indexOf('/mockapi/') == 0;
    if (global.__envVar.enableMock){
      // bodyParser.json()(req, res, ()=>{});
      // bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
      mockMid(req, res, next, {
        mockPath: finalOpt.mockPath,
        delay: finalOpt.delay
      });
    } else {
      next();
    }
  });

  /** 前端页面 */ 
  app.use('/devTools', Express.static(path.resolve(__dirname, './dist')));
  /** 服务接口 */
  app.use('/devTools/api', function(req, res, next){
    bodyParser.json()(req, res, ()=>{});
    bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
    setTimeout(()=>next(), 50);
  })
  app.use('/devTools', require('./services'));

}