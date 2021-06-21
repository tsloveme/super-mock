# super-mock-middleware
一个基于express 的mock数据中间件，模拟真实ajax请求，支持json文件、js模块

## 用法
    npm install super-mock-middleware --save-dev
在create-react-app 的工程中新建 src/setupProxy.js文件
```js
const SuperMock = require('super-mock-middleware);

module.exports = function (app) {
  SuperMock.install(app);
}
```
### mock目录，mock文件规则
工程根目录新建mock目录
接口：/api/user/userList 匹配的mock文件优先级如下从高到低如下：
1. /mock/api/user/userList.js
2. /mock/api/user/userList.json
3. /mock/user/userList.js
4. /mock/user/userList.json
5. /mock/userList.js
6. /mock/userList.json
    mock数据文件都是实时生效的。修改即生效，无需重启工程。

## mock开关用法
访问工程 /devTools/ 页面
关闭mock, 所有mock数据失效，/api/user/userList 去工程配置的代理查找匹配的规则。有代理到的话就代理到远程服务数据。没有的话就404
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-home.png)

## 代理配置
/devTools/#/proxy
页面可以配置代理，尝试代理规则，启用、禁用代理规则。提交的更改实时生效。无需重启webpack工程
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-proxy.png)
