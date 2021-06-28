English | [简体中文](https://github.com/tsloveme/super-mock/blob/master/README-zh-CN.md) 
# super-mock-middleware
a mock middle ware base on express.js  mock the real ajax request, support the json, js; and more easy to configure the proxy of your project

## Useage
    npm install super-mock-middleware --save-dev
### 1. in react project
```bash
create-react-app react-demo
```
new file: "react-demo/src/setupProxy.js" 
```js
const SuperMock = require('super-mock-middleware);

module.exports = function (app) {
  SuperMock.install(app);
}
```
### 2. in express project
```javascript
const express = require('express');
const SuperMock = require('super-mock-middleware);
const app = express();
SuperMock.install(app);
// other middlewares
// ...
app.listen(3000);
```
### 3. in webpack-dev-server
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

## Mock Rules
mock data path is /mock in project root
it will search the directory and try match the js file and json file;
for example: **/api/user/userList**
try to match file as following rule(Depth-First-Search):
- /mock/api/user/userList.(js|json)
- /mock/\*\*/user/userList.(js|json)
- /mock/\*\*/userList.(js|json)
- /mock/userList.(js|json)


the middleware delete the require cache of the path: /mock, so it works as you modify it。and you don't need to restart the project;
## Mock file

#### 1. a json file
```json
{
  "success": true,
  "code": "0000",
  "data" : {
    "name": "chentangsong",
    "job": "front end",
    "hobies": "coding, beer, meat"
  }
}
```

#### 2. a javascript module
```javascript
// this is a module to respone the request
module.exports = {
  success: true,
  code: "0000",
  data: [
    {name: 'chentangsong', company: 'pingan'},
    {name: 'robot', company: 'microsoft'}
  ]
}
```

#### 3. an express middleware
```javascript
module.exports = function(req, res, next){
  let userId = req.query.userId || req.body.userId;
  let userList = [
    {userId:123, name: 'chentangson-vip', company: 'pingan'},
    {userId:456, name: 'robot-vip', company: 'microsoft'}
  ];
  let user = userList.find(u=>u.userId == userId);
  if (!user) user = userList[0];
  res.send({
    data: user,
    success: true,
    code: "0000"
  });
}
```

**[Sample](https://github.com/tsloveme/super-mock/tree/master/mock/api/user)**


## Toggle The Mock Data
visit the page: /devTools/
turn off/on the mock, when the toggle on, all then requests go to the middleware, when it match a file, it will response and return. otherwire, it go ahead to next middleware.
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-home1.png)

## Configure The Proxy
visit the page: /devTools/#/proxy
you can try it out before adding a proxy route or modifing a proxy rule; enable/disable a proxy rule, it works as you commit, do not need to restart you project.
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-proxy1.png)


![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-proxy2.png)
