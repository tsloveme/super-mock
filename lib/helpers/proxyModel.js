/*
 * Created Date: Tuesday May 25th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Tuesday May 25th 2021 6:07:47 pm
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
const getPort = require('./getPort');
const bodyParser = require('body-parser');
const proxyproxyMiddleware = require("http-proxy-middleware");
const cacheProxiesPath = path.resolve(__dirname, '../../cache/__proxies.js');
const { getCurrentRemoteServerIp, dynamicProxys } = require('../config');

module.exports.tryProxy = tryProxy;

/**
 * 代理尝试函数, 用给定的req请求到内建服务器，返回转发路径
 * @param {*} req Express request
 * @param {*} res Express response
 * @param {*} next Express next
 * @param {*} proxyConfig  http-proxy-middleware的代理配置
 * @param {*} toServer 代理的路径
 * 
 */
function tryProxy(req, res, next){
  let proxyConfig = (req.body||{}).proxyConfig || {};
  getPort.makeRange(11000, 11100)
    .then(port=>{
      let app = Express();
      let serverInstance = app.listen(port, err=>{
        if (!err) {
          console.log('new test proxy server running at port: ' + port);
          // http-proxy-middleware代理配置组合
          Object.assign(proxyConfig, {
            target: `http://127.0.0.1:${port}`,
            changeOrigin: false
          });
          let proxyFn = proxyproxyMiddleware(proxyConfig);
          // 代理到内建http服务器
          proxyFn(req, res, next);
        } else {
          console.warn('proxy test server start up err at port: ' + port);
          res.send({code: '0000', success: false, message: err.toString()});
        }
      });
      app.use(function(req, res, next){
        res.send({
          code: '0000',
          success: true,
          path: req.path
        });
        // 关闭http服务器实例，释放资源
        serverInstance.close();
      });
    })
}

/**
 * 代理尝试函数, 代理到远程服务器，查看代理是否正确
 * @param {*} req Express request
 * @param {*} res Express response
 * @param {*} next Express next
 * @param {*} proxyConfig  http-proxy-middleware的代理配置
 * 
 */
function tryProxyRemote(req, res, next, proxyConfig={}){
  // http-proxy-middleware代理配置组合
  let config = {
    target: `http://${getCurrentRemoteServerIp()}`,
    changeOrigin: false
  }
  Object.assign(config, proxyConfig);
  if (!config.headers || !config.headers.host) {
    let headers = config.headers || {};
    headers.host ='m.lu.com';
    config.headers = headers;
  }
  let proxyFn = proxyMiddleware(config);
  // 代理到远程http服务器
  proxyFn(req, res, next);
}


/**
 * 增加动态代理配置
 * @param {*} option 代理配置
 */
function addProxy(option={}){
  let active = option.active;
  let proxyPath = option.proxyPath;
  let proxyConfig = option.proxyConfig;
  if (!proxyPath) return Promise.reject('proxyPath必传！');
  if (!proxyConfig) return Promise.reject('proxyConfig必传！');
  if (typeof proxyConfig != 'object') return Promise.reject('proxyConfig类型错误！');
  return new Promise((resolve, reject)=>{
    let proxies = readProxies();
    if (proxies.find(prox=>prox.proxyPath == proxyPath)) {
      return reject(`已经存在相同路径的的代理:${proxyPath}`);
    }
    let now = Date.now();
    let id = guid();
    proxies.push({
      proxyPath,
      proxyConfig,
      created: now,
      modify: now,
      id,
      active
    });
    writeProxieToCache(proxies)
      .then(()=>{
        resolve(id);
      })
      .catch(err=>{
        resolve(err.toString())
      })
  })
}

/**
 * 修改动态代理配置
 * @param {*} proxyPath 代理路径
 * @param {*} proxyConfig http-proxy-middleware的代理配置
 */
function modifyProxy(option){
  let id = option.id;
  let active = option.active;
  let proxyPath = option.proxyPath;
  let proxyConfig = option.proxyConfig;
  if (!id) return Promise.reject('id必传！');
  if (!proxyPath) return Promise.reject('proxyPath必传！');
  if (!proxyConfig) return Promise.reject('proxyConfig必传！');
  if (typeof proxyConfig != 'object') return Promise.reject('proxyConfig类型错误！');
  return new Promise((resolve, reject)=>{
    let proxies = readProxies();
    let proxy = proxies.find(prox => prox.id == id);
    if (!proxy) return reject(`id为${id}的记录不存在！`);
    let now = Date.now();
    if (active !== undefined) {
      proxy.active = active;
    }
    proxy.proxyConfig = proxyConfig;
    proxy.proxyPath = proxyPath;
    proxy.modify = now;
    writeProxieToCache(proxies)
      .then(()=>{
        resolve();
      })
      .catch(err=>{
        resolve(err.toString())
      })
  })
}

/**
 * 代理写入缓存
 * @param {*} proxies 
 */
function writeProxieToCache(proxies){
  let codeStr = `// 程序自动缓存生成请勿手动修改\nmodule.exports = ${JSON.stringify(proxies, null, 2)}`;
  return fse.writeFile(cacheProxiesPath, codeStr, {encoding: 'utf-8'});
}

function readProxies(){
  let defautProxies = JSON.parse(JSON.stringify(dynamicProxys));
  try {
    fse.statSync(cacheProxiesPath);
    delete require.cache[require.resolve(cacheProxiesPath)];
    let mod = require(cacheProxiesPath);
    return mod;
  } catch(e) {
    console.warn(`本地缓存中没有找到配置: ${cacheProxiesPath}`);
    console.log(`新建缓存文件：${cacheProxiesPath}`);
    fse.ensureFileSync(cacheProxiesPath);
    let codeStr = `// 程序自动缓存生成请勿手动修改\nmodule.exports = ${JSON.stringify(defautProxies, null, 2)}`;
    fse.writeFileSync(cacheProxiesPath, codeStr, {encoding: 'utf-8'});
  }
  return require(cacheProxiesPath);
}



function guid() {
  var dateStr = '';
  var date = new Date();
  dateStr += date.getFullYear();
  var month = date.getMonth() + 1;
  dateStr += (month >= 10 ? month : '0' + month);
  var days = date.getDate();
  dateStr += (days >= 10 ? days : '0' + days);
  var hours = date.getHours();
  dateStr += (hours >= 10 ? hours : '0' + hours);
  var minutes = date.getMinutes();
  dateStr += (minutes >= 10 ? minutes : '0' + minutes);
  var seconds = date.getSeconds();
  dateStr += (seconds >= 10 ? seconds : '0' + seconds);
  return `${dateStr}-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}
/**
 * node 利用http发送请求
 */
function httpGet(url){
  return new Promise((resolve, reject)=>{
    https.get(url, (resp) => {
      let data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log('JSON.parse(data)');
        console.log(JSON.parse(data));
        resolve(JSON.parse(data))
      });
    }).on("error", (err) => {
      reject("Error: " + err.message);
    });
  })
}

/**动态代理中间件*/
function handleDynamicProxies(req, res, next) {
  let fullPath = req.path;
  let proxies = readProxies();
  let proxy = proxies.find(prox => {
    return fullPath.indexOf(prox.proxyPath) === 0 && prox.active
  });
  if (proxy) {
    console.log(`\n`);
    console.log(`命中动态代理规则`);
    let proxyConfig = proxy.proxyConfig || {};
    proxyConfig = Object.assign({
      target: `http://${getCurrentRemoteServerIp()}`,
      changeOrigin: false
    }, proxyConfig);
    console.log(JSON.stringify(proxyConfig, null, 2));
    let proxyFn = proxyproxyMiddleware(proxyConfig);
    // 代理到内建http服务器
    proxyFn(req, res, next);
  } else {
    next();
  }
}
 // 尝试代理机制 http-proxy-middleware 的 tryProxy
 function handleTryProxy(req, res, next){
  if (req.query.__tryProxy === '1') {
    bodyParser.json()(req, res, ()=>{});
    bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
    return setTimeout(()=>tryProxy(req, res, next), 50);
  } else {
    next();
  }
}

module.exports = {
  tryProxyRemote,
  tryProxy,
  readProxies,
  addProxy,
  modifyProxy,
  handleDynamicProxies,
  handleTryProxy
}