/**
 * 为其他系统提供服务
 * 在此目录下的文件名或者文件夹名对应 接口路径第一级
 * 1.譬如  /services/user/infoList  POST
 * 对应  user.js 模块中的 infoList.post方法
 * 2.譬如  /services/media/send/voice   POST
 * 对应  media 文件夹中 index.js 模块中的 media.send.voice.post 方法
 * 
 * 注意：自动路由模块支持(一级目录+index.js)，多级路径的话请自行处理
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let fs = require('fs');

module.exports = function(req, res, next){
    let type = req.method.toLocaleLowerCase();
    let reqPathArr = req.path.split('/').slice(1);
    let handleModule;
    let pathName = reqPathArr.shift();
    console.log(pathName)
    try {
        handleModule = require(`./${pathName}`);
    } catch(e) {
        return next();
    }
    // 全路径的匹配情况
    let handleMethod = handleModule[`/${reqPathArr.join('/')}`];
    if (!handleMethod) {
        do {
            let pathName = reqPathArr.shift();
            if (handleMethod) {
                handleMethod = handleMethod[`/${pathName}`] || handleMethod[pathName]; //新增路径支持(用法见sso.js)
            } else {
                handleMethod = handleModule[`/${pathName}`] || handleModule[pathName]; //新增路径支持(用法见sso.js)
            }
        } while (reqPathArr.length && handleMethod)
    }
    
    
    if (handleMethod) {
        if (handleMethod[type] && typeof handleMethod[type] == 'function') {
            return handleMethod[type](req, res, next);
        }
        let methods = [];
        for (let key in handleMethod) {
            if (typeof handleMethod[key] == 'function'){
                methods.push(key);
            }
        }
        if(methods.length) {
            res.status(415);
            res.send({errcode: 415, errmsg: `接口 services${req.path}不支持${type}请求方式, 请用${methods.join(',')}方式发送`});
        } else {
            return next()
            console.log('没有声明请求方法');
            res.status(404);
            res.send({errcode: 400, errmsg: `找不到接口: services${req.path}`});
        }
        
    } else {
        return next();
        console.log('handleMethod 找不到')
        res.status(404);
        res.send({errcode: 400, errmsg: `找不到接口: services${req.path}`});
    }
}