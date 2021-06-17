/**
 * find a useable tcp port
 * Created Date: Tuesday January 12th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Tuesday January 12th 2021 2:21:33 pm
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */

const net = require('net');

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

module.exports.makeRange = (from = 10000, to=65535) => {
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
