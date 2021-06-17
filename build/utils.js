/*
 * Created Date: Monday June 7th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Monday June 7th 2021 8:21:46 pm
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */
const os = require('os');
const path = require('path');
const net = require('net');

// 获取IP地址
function getIPAddress() {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var ip = '';
  for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
          if (ip === '' && details.family === 'IPv4' && !details.internal) {
              ip = details.address;
              return;
          }
      });
  }
  return ip || "127.0.0.1";
};

/**
 * 目录解析函数
 * @param {String} str 
 * @returns {String} 绝对路径
 */
function resolvePath(str){
  let projectRoot = path.resolve(__dirname, '../');
  return path.resolve(projectRoot, str);
}
/**
 * 检测端口是否可用
 * @param {*} options
 * @returns Promise
 */
const getAvailablePort = options => new Promise((resolve, reject) => {
	const server = net.createServer();
	server.unref();
	server.on('error', reject);
	server.listen(options, () => {
		const { port } = server.address();
		server.close(() => {
			resolve(port);
		});
	});
});

/**
 * 从给定的端口开始查找一个可用的tcp端口
 * @param {*} from 
 * @param {*} to 
 * @returns Promise.resole(port);
 */

const getFreePort = (from = 10000, to=65535) => {
	return new Promise((resolve, reject) => {
		if (!Number.isInteger(from) || !Number.isInteger(to)) {
			reject('`from` and `to` must be integer numbers');
		}
		if (from < 1024 || from > 65535) {
			reject('`from` must be between 1024 and 65535');
		}
		if (to < 1024 || to > 65536) {
			reject('`to` must be between 1024 and 65536');
		}

		if (to < from) {
			reject('`to` must be greater than or equal to `from`');
		}
		let cpFrom = from, cpTo = to;
		const detectPort = ()=>{
			if (cpFrom > to) {
				reject(`no avilable port from ${from} to ${to}`);
			}
			let port = cpFrom ++;
			getAvailablePort({port})
			.then(ret=>{
				resolve(port);
			})
			.catch(()=>{
				detectPort();
			})
		}
		detectPort();
	})
};

module.exports = {
  getIPAddress,
  resolvePath,
  getFreePort,
}