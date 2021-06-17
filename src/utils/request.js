/*
 * ajax请求模块封装
 * Created Date: Monday June 7th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Monday June 7th 2021 12:47:30 am
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */

import Vue from 'vue';
import Axios from 'axios';
import { MessageBox } from 'element-plus';
/**
 * 给url加参数(get传参数) option 为Object类型
 */
const addQs2Url = (url, option)=> {
	if(!option) return url;
	if(!/\?\w/.test(url)) url+='?';
	var arr = [];
	for(var key in option){
			arr.push(key+'='+option[key]);
	}
	return url + arr.join('&')
}

//创建一个单例的全局loading供request模块使用
let mountEl = document.createElement('div');
mountEl.setAttribute('id','globalLoading');
let loadingData = {loading:0};
let loadingInstance;
setTimeout(() => {
	loadingInstance = new Vue({
		el:mountEl,
		data:loadingData,
		template:`<div v-loading.fullscreen.lock="loading" 
			element-loading-background="rgba(255,255,255,0.35)" 
			element-loading-text="处理中..." ></div>`
	});
	document.body.appendChild(loadingInstance.$el);
}, 0);


/**
 * 请求模块
 * 参数项
 *  @param url [String] 请求的接口地址,
 *  @param method [String] 请求类型 默认post 其他：get put delete,
 *  @param data [Object] 请求接口附带的参数,
 *  @param timeout [Int] 默认30秒过期,
 *  @param loading [Boolean] 默认加载全局loading,
*/

const Request = (option={}) => {
	let {
		url,
		method='POST',                  // 请求方法
		data={},                        // 发送的数据
		timeout = 30000,                // 默认30秒过期
		loading = true,                 // 默认加载全局loading
		autoHandleErr = true,           // 自动处理错误
		judgeSuccess = {success: true}  // 判断请求是否成功的标示（非网络错误的情况）
	} = option;
	if (!url) {
		return Promise.reject({message: 'url is required!'});
	}

	loading && loadingData.loading++;
	if(method.toLowerCase() == 'get'){
		url = addQs2Url(url,data);
	}
	let axiosOption = {url, method, timeout, data};
	let axiosResult = new Promise(function(resolve, reject){
		Axios.request(axiosOption)
			.then(function(res){
				//请求成功把globalLoading 状态减去1
				if(loading){
					setTimeout(() => loadingData.loading--, 0);
				}
				let resData = (res.data || {});
				if(resData.success){
					resolve(resData)
				} else {
					resData.message = resData.message || '未知错误';
					reject(resData);
				}
		})
		.catch(function(error){
			//请求失败也要把globalLoading 状态减去1
			if(loading){
				setTimeout(() => loadingData.loading--, 0);
			}
			if (autoHandleErr) {
				let message = error.message || error.toString();
				MessageBox({title:"请求出错！",message, type:"error"});
			}
			reject('请求出错')
		})
	})
	axiosResult.catch(err=>{
		console.log('请求错误!');
		console.log(url);
		console.log(err);
	})
	return axiosResult;
}
export default Request; 
