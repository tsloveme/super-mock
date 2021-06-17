/*
 * Created Date: Saturday May 8th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Saturday May 8th 2021 9:36:47 am
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */



const path = require('path');
const fse = require('fs-extra');
const config = require('../../config');
const cacheEnvFilePath = path.resolve(__dirname, '../../cache/__env.json');
let { defautSetting } = config
defautSetting = JSON.parse(JSON.stringify(defautSetting));

/**
 * 缓存中读取配置
 */
function readEnvFromCache(){
    let env = defautSetting;
    try {
        env = fse.readJSONSync(cacheEnvFilePath)
    } catch(e) {
        console.warn(`本地缓存中没有找到配置: ${cacheEnvFilePath}`);
        console.log(`新建缓存文件：${cacheEnvFilePath}`);
        fse.ensureFileSync(cacheEnvFilePath);
        fse.writeJSONSync(cacheEnvFilePath, defautSetting, {spaces: 4});
    }
    return env;
}
/**
 * 写配置入缓存
 * @param {*} option 
 */
function writeEnvToCache(option={}){
    const env = global.__env || defautSetting;
    for (let k in option) {
        env[k] = option[k];
    }
    fse.writeJSONSync(cacheEnvFilePath, env, {spaces: 4});
}

module.exports = {
    readEnvFromCache,
    writeEnvToCache
}