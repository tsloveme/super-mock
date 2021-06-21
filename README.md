# super-mock-middleware
a mock middle ware base on express.js  mock the real ajax request, support the json, js;

## Useage
    npm install super-mock-middleware --save-dev
for example, in react project(created by create-react-app) new file: "src/setupProxy.js" import the middleware, install it;
```js
const SuperMock = require('super-mock-middleware);

module.exports = function (app) {
  SuperMock.install(app);
}
```
### Mock Path & Mock Rules
it will search the /mock directory of the project, and match the json and js files;
sample：/api/user/userList (file to match from high priority to low as following order)：
1. /mock/api/user/userList.js
2. /mock/api/user/userList.json
3. /mock/user/userList.js
4. /mock/user/userList.json
5. /mock/userList.js
6. /mock/userList.json
    the middleware disable require.cache for the mock file, it works as you modify it。and you don't need to restart the project;

## Mock Toggle
visit the page: /devTools/
turn off the mock, all the requests go to the remote server or handle by other middleware.
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-home.png)

## configure the proxy
visit the page: /devTools/#/proxy
you can try it out before adding a proxy route or modifing a proxy rule; enable/disable a proxy rule, it works as you commit, do not need to restart you project.
![](https://raw.githubusercontent.com/tsloveme/super-mock/master/images/sample-proxy.png)
