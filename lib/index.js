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
const path = require("path");
const Express = require('express');
const http = require('http');
const https = require('https');
const sockjs = require('sockjs');
const bodyParser = require('body-parser');
const { makeRange } = require('./helpers/getPort');
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

module.exports.install = function(app) {
  // 前端页面
  app.use('/devTools', Express.static(path.resolve(__dirname, './dist')));
  // 服务接口
  app.use('/devTools/api', function(req, res, next){
    bodyParser.json()(req, res, ()=>{});
    bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
    setTimeout(()=>next(), 50);
  })
  app.use('/devTools', require('./services'));

}