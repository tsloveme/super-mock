/**
 * 1. a standare json format files
 * sample: '/mockData/user/admin.json'
 * request: '/mockapi/xxx/.../xxx/user/admin'
 * response：json file contents
 * 
 * 2.auto route the js module
 * module: '/mockData/user/list.js' 
 * request: '/mockapi/xxx/.../xxx/user/list'
 * response: the result of modules
 * 
 * 3. express middleware
 * sample:            '/mockData/user/listV2.js' 
 * handle request:    '/mockapi/xxx/.../xxx/user/listV2'
 * response content:  express res.send
 */
const path = require("path");
const glob = require('glob');
const bodyParser = require('body-parser');
const mockPath = path.resolve(process.cwd(), 'mock');
const pathSplit = path.sep; // 目录分隔符： windows: \\ linux: /

module.exports = function (req, res, next) {
  const reqPath = req.path;
  const reqBaseUrl = req.baseUrl;
  const reqFullPath = reqBaseUrl + reqPath;
  
  // 清mockPath内的模块缓存，以便修改json、js问件时实时生效。
  // clear the module cache to ensure hot load the json/js modules 
  for(let moduePath in require.cache){
    if (moduePath.indexOf(mockPath) == '0') delete require.cache[moduePath];
  }

  let handlerFile = tryMatchModules(reqFullPath);
  if (handlerFile) {
    console.log('handlerFile=====');
    console.log(handlerFile);
    bodyParser.json()(req, res, ()=>{});
    bodyParser.urlencoded({ extended: true })(req, res, ()=>{});
    setTimeout(()=>{
      let reqDelay = req.body.delay || req.query.delay || 50;//延迟时间
      reqDelay = parseInt(reqDelay);
      let mockFile = path.relative(mockPath, handlerFile);
      console.log(`use mock file： ${mockFile}`);
      try {
        if (handlerFile.match(/\.js$/)) {
          let handlerMod = require(handlerFile);
          if (typeof handlerMod == 'function') {
            // middleware
            let newRes = {};
            for (let k in res) {
              if (typeof res[k] == 'function') {
                newRes[k] = (...args) => res[k](...args);
              } 
            }
            newRes.send = (data)=>{
              data.mockPath = mockPath;
              data.mockFile = mockFile;
              res.send(data);
            }
            setTimeout(()=>handlerMod(req, newRes, next), reqDelay);
          } else if (typeof handlerMod == 'object') {
            let returnData = {};
            //成功失败分支
            if (handlerMod.successReturn || handlerMod.errorReturn) {
              if (handlerMod.rate === undefined) {
                handlerMod.rate = 1;
              }
              if (handlerMod.rate > 1 - Math.random()) { // rate of success
                returnData = handlerMod.successReturn;
              } else {
                returnData = handlerMod.errorReturn;
              }
            } else {
              // 普通对象
              returnData = handlerMod;
            }
            returnData.mockPath = mockPath;
            returnData.mockFile = mockFile;
            setTimeout(()=>res.send(returnData), reqDelay);
          }
        } else {
          let jsonData = require(handlerFile);
          jsonData.mockPath = mockPath;
          jsonData.mockFile = mockFile;
          setTimeout(()=>res.send(jsonData), reqDelay);
        }
      } catch (e) {
        console.warn(`mock数据文件有语法错误：`);
        console.warn(e);
      }
    }, 0);
  } else {
    // can'nt match any file in the mockData path;
    next();
  }
}

/**
 * 模块加载器
 * 从传入的路径去匹配，
 * 从深至浅，有匹配到则停止搜索。
 * 同级目录js文件优先。
 * 没有则从前边将一个目录继续搜索。
 * 如果再同一个匹配模式下有多个结果，目录浅的文件优先。
 * @param [String] reqFullPath
 * @param [String] suffix
 * @returns [String] filePath
*/
function tryMatchModules(reqFullPath) {
  if (!reqFullPath) {
    console.log('reqFullPath is required');
    return false;
  }
  let pathArr = reqFullPath.split('/').filter(Boolean);
  let fileName = pathArr.pop();
  let matchRet = [];
  do {
    var matchPattern = `${mockPath}${pathSplit}**${pathSplit}${pathArr.join(pathSplit)}${pathSplit}${fileName}.*`;
    // console.log(matchPattern);
    matchRet = glob.sync(matchPattern);
    pathArr.shift();
  } while (pathArr.length && !matchRet.length);

  if (!matchRet.length) {
    return false;
  } else if (matchRet.length == 1) {
    return matchRet[0];
  } else {
    // 即有json文件又有js文件则先过滤掉json文件, js文件优先
    if (matchRet.find(i=>i.match(/\.json$/)) && matchRet.find(i=>i.match(/\.js$/))) {
      matchRet = matchRet.filter(i=>i.match(/\.js$/))
    }
    // 排序
    matchRet.sort((a,b)=>{
      return a.split(pathSplit).length - b.split(pathSplit);
    });
    return matchRet[0]
  }
}