/*
 * Created Date: Sunday June 13th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Sunday June 13th 2021 10:24:06 pm
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */
const envModel = require('../helpers/envModel');
const proxyModel = require('../helpers/proxyModel');
function groupSend(obj={}){
 global.sockClients.forEach(conn=>{
    conn.write(JSON.stringify(obj))
  })
}

// 读取环境配置信息
function readAllEnv(){
  return global.__envVar || envModel.readEnvFromCache();
}
function genError(str='devTools错误',code='9999'){
  return {code, message: str};
}

module.exports = {
  "/env-system-info": {
    get: getEnvSystemInfo
  },
  "/env-toggle-mock": {
    get: toggleMock
  },
  "/env-proxy-list": {
    get: getProxyList
  },
  "/env-proxy-modify": {
    post: modifyProxy
  },
  "/env-proxy-add": {
    post: addProxy
  }
}

/**
 * 获取环境信息
 */
function getEnvSystemInfo(req, res, next){
  let env = readAllEnv();
  res.send({
    data: env, code: '0000'
  })
};

// 开关mock数据
function toggleMock(req, res, next){
  let result = global.__envVar.enableMock;
  envModel.writeEnvToCache({enableMock: !result});
  groupSend({envChange: true});
  res.send({
    code: '0000', data: !result
  })
}
// 接口:获取动态代理列表
function getProxyList(req, res, next){
  try {
    let proxies = proxyModel.readProxies();
    res.send({
      code: '0000', data: proxies
    })
  } catch (e) {
    res.send(genError(e.toString()))
  }
}
// 接口:动态代理修改
function modifyProxy(req, res, next){
  let reqData = req.body;
  proxyModel.modifyProxy(reqData)
    .then(ret=>{
      res.send({
        code: '0000', data: {}, message: '修改动态代理配置成功！'
      })
    })
    .catch(err=>{
      res.send(genError(err.toString()))
    });
}
// 接口:动态代理新增
function addProxy(req, res, next){
  let reqData = req.body;
  proxyModel.addProxy(reqData)
    .then(ret=>{
      res.send({
        code: '0000', data: {id: ret}, message: '新增动态代理配置成功！'
      })
    })
    .catch(err=>{
      res.send(genError(err.toString()))
    });
}