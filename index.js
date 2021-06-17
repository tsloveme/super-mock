/**
 * Created Date: Saturday May 8th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Saturday May 8th 2021 9:36:47 am
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pathToRegexp = require('path-to-regexp');
const fse = require('fs-extra');
const envModel = require('./devTools/helpers/envModel');
const proxyModel = require('./devTools/helpers/proxyModel');
global.__env = envModel.readEnvFromCache();
module.exports = function (app) {
  console.log(`当前环境：${global.__env.current}`);
  // 静态资源
  app.use('/devStatic', express.static(path.join(__dirname, './devStatic')));

  //  devTools
  require('./devTools')(app);
  app.use(proxyModel.handleTryProxy); //尝试代理接口（本地内建服务器模拟）
  app.use(proxyModel.handleDynamicProxies); //代理数据接口至动态代理
  /**
   * mock数据的无缝切换
   * 可以写生产、环境上的路径 (/开头, 非域名开头) 在前端页面开关启用
   */
  app.use(function(req, res, next){
    // 匹配接口路由
    let proxyPaths = require('./config').proxyPaths;
    let isMatchApiPath = proxyPaths.find(item => {
      return req.path.indexOf(item) == 0;
    });
    let isMatchMockApiPath = req.path.indexOf('/mockapi/') == 0;
    if ((global.__env.enableMock && isMatchApiPath) || isMatchMockApiPath  ){
      bodyParser.json()(req, res, ()=>{});
      bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
      require('./mockServer')(req, res, next);
    } else {
      next();
    }
  });
  // 环境上的palubao/mch-insurance代理
  require('./proxyCommon')(app);
  // 设备指纹系统代理
  require('./proxyInfoLu')(app);
  // 本地静态资源
  require('./proxyH5User')(app);
  // 滑块验证码系统
  require('./proxyMVerify')(app);
  // 本地开发环境可以实现交易
  require('./proxyH5Trading')(app);
}

module.exports.removeMiddleware = removeMiddleware;
/**
 * 移出中间件官方暂无可用api 目前这种方式有bug暂未使用
 * 中间件卸载
 * 用于变更环境时，先卸载，在安装
 * 注意：全局中间件或者未指定路径的中间件不会处理
*/
function removeMiddleware(app){
  // 所有需要重新加载的中间件的集合
  const matchPath = [
    '/mockapi',
    '/fc-insurance/service',
    ['/api/h5-market'],
    '/h5-user',
    '/api/user',
    ['/sec-info'],
    ['/api/m-verify','/m-verify'],
  ];
  let regArr = matchPath.map(item=>pathToRegexp(item));
  //中间件移出
  let middlewareArr = app._router.stack;
  for (let j = middlewareArr.length-1; j > -1; j--) {
    let middle = middlewareArr[j];
    let regStr = '';
    if (regArr.some(reg=>{
      regStr = reg.toString().replace('?$/i', '?(?=\\/|$)/i');
      return regStr == middle.regexp.toString();
    })) {
      console.log(`删除中间件: ${regStr}`);
      middlewareArr.splice(j, 1);
    }
  }
}
