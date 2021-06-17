
/**
 * @param {String|Object} option url或者配置对象：
 * 如果是url则,直接post url 不传参
 * 如果是object配置对象，参数说明如下：
 * option.url: 绝对地址或者相对地址 绝对地址就填写 绝对地址： "/mch-insurance/service/cms/product-info"  或者相对地址："cms/product-info" 效果一样
 * option.method: 跟 AbstractModel 里面的一样
 * option.data: 请求附带的参数跟AbstractModel保持一致
 * option.isShowLoading: 这里不做处理直接帮你往AbstractModel里边传  0: 不显示loading  2：显示loading
 * jugle: 判断成功的条件
 * @returns  {Promise} 返回一个promise对象
*/
if (window.require) {
    var ELEMENT = require('../element/element-ui.2.6.1.min.js')
}

/**
 * 
 * @param {*} str 
 * @param {*} type 
 * @param {*} duration 
 */
function showMsg(str, type, duration){
	if (!type) {
		type= 'success'
	} else if(typeof type == 'number'){
		duration = type;
	} else {
		duration = duration && (typeof duration == 'number') ? duration : 1000;
	}
	ELEMENT.Message({type: type, message: str, duration: duration})
}
function Request(option){

    let url,
    method = 'post',
    data = {},
    isShowLoading = '2', 
    jugle={code: '0000'},
    autoHandleError = true;
	if(typeof option == 'string') {
		url = option;
	} else if (typeof option === 'object') {
		// 深拷贝，防止修改外部数据
		option = deepCopy(option);
		url = option.url || '/';
		method = option.method || method;
		data = option.data || {}; // 请求参数
		isShowLoading = option.isShowLoading || isShowLoading;
        jugle = option.jugle || jugle;
        if (option.autoHandleError !== undefined) {
            autoHandleError = option.autoHandleError;
        }
		
	}
    method = method.toLowerCase();
    let req;
    if (method == 'post') {
        req = ajax.request({url, method: 'post', data});
    } else {
        req = ajax.request({url, params: data, method: 'get'});
    };
	let reqRet = new Promise((resolve, reject) => {
        req.then(function(ret){
			let body = ret.data;
			let isSuccess = true
			for (let k in jugle) {
				if (body[k] !== jugle[k]) {
					isSuccess = false
				}
			}
            if (isSuccess) {
				resolve(body);
			} else {
				reject(body);
			}
        });
        req.catch(function(err){
            reject(err);
        })
	});
	reqRet.catch(err=>{
        if (autoHandleError) {
            ELEMENT.MessageBox.alert(err.message);
        } else {
            ELEMENT.MessageBox.alert(`请求发生错误：${typeof err == 'object' ? JSON.stringify(err) : err.toString()}`);
        }
        reject(err);
		// console.warn(`请求发生错误：${typeof err == 'object' ? JSON.stringify(err) : err.toString()}`);
	})
	return reqRet;
}
Request.get = (...option) => {
	if (!option.length) return Promise.reject(`参数错误！`);
	let [url = '/', data={}, config={}] = option;
	data = deepCopy(data);
	config = deepCopy(config);
	config.method = 'get';
	const combineConf = {...config, url, data};
	return Request(combineConf);
}
Request.post = (...option) => {
	if (!option.length) return Promise.reject(`参数错误！`);
	let [url = '/', data={}, config={}] = option;
	data = deepCopy(data);
	config = deepCopy(config);
	config.method = 'post';
	const combineConf = {...config, url, data};
	return Request(combineConf);
}
function deepCopy(obj) {
	if (typeof obj !== 'object') {
		return obj;
	} else {
		return JSON.parse(JSON.stringify(obj));
	}
}