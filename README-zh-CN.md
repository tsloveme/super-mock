简体中文 | [English](./README.md) 
# super-mock-middleware
一个基于express 的mock数据中间件，模拟真实ajax请求，支持json文件、js模块。还能更加方便地去配置你的工程中的接口代理。可视化配置代理，配置即生效。

## 用法
    npm install super-mock-middleware --save-dev
### 1. 标准react工程配置
```bash
create-react-app react-demo
```
新建文件: "react-demo/src/setupProxy.js" 
```js
const SuperMock = require('super-mock-middleware);

module.exports = function (app) {
  SuperMock.install(app);
}
```
### 2. 在express应用
```javascript
const express = require('express');
const SuperMock = require('super-mock-middleware);
const app = express();
SuperMock.install(app);
// 其他中间件
// ...
app.listen(3000);
```
### 3. 在webpack-dev-server中
webpack.config.js
```javascript
const SuperMock = require('super-mock-middleware);
module.exports = {
  //...
  devServer: {
    before: function (app) {
      SuperMock.install(app);
    },
  },
};
```
## mock文件规则
mock数据的默认目录是在工程跟路径下的： /mock
此中间件尝试在mock目录中匹配js文件和json文件;
例如: **/api/user/userList**
将尝试如下的匹配规则，匹配到直接响应mock数据(目录深度优先匹配):
>/mock/api/user/userList.(js|json)
>/mock/\*\*/user/userList.(js|json)
>/mock/\*\*/userList.(js|json)
>/mock/userList.(js|json)

匹配不到，则请求会跳过此中间件，进入下一个中间件


    mock数据文件都是实时生效的。修改即生效，无需重启工程。

## mock开关用法
访问项目重的 /devTools/ 页面
关闭mock, 所有mock数据失效，请求跳过此中间件。
打开mock, /api/user/userList 匹配工程的mock文件夹中的文件。匹配得到的话，请求响应，返回mock 数据。
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/cn/sample-home1.png)

## 代理配置
/devTools/#/proxy
页面可以配置代理，尝试代理规则，启用、禁用代理规则。提交的更改实时生效。无需重启webpack工程
数据代理优先级是在mock数据中间件之后。
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/cn/sample-proxy1.png)


![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/cn/sample-proxy2.png)
