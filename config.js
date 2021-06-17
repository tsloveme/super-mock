/*
 * Created Date: Saturday May 8th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Saturday May 8th 2021 9:36:47 am
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */


/**
 * 项目第一次启动时候的默认配置，
 * 后续程序自动生成的配置在cache/__env.json里边 并以它为开发环境的配置项
 * 不要在这里添加配置，，这个配置只是_env.json的初始状态，
 * 每个开发人员cache/__env.json里边的东西都不一样，可以理解为 devTools工具的数据库
 */
const proxyTable = [
  {
    path: '/api',
    option: {
      target: 'http://192.168.100.102:8080',
      pathRewrite: {
        '^/api': '/'
      },
      changeOrigin: false
    }
  },
  {
    path: '/services',
    option: {
      target: 'http://192.168.100.103:8080',
      pathRewrite: {
        '^/services': '/'
      },
      changeOrigin: false
    }
  }
];
const defautSetting = {
  enableMock: true,
};

/**
 * 动态代理默认配置，(因为这里有函数, 正则什么的，不能存放于json文件，只能以js模块的方式)
 * 工程第一次生成的配置在cache/__dynamicProxys.js 里边
 * 不要在这里添加配置，，这个配置只是__dynamicProxys 的初始状态，
 * 每个开发人员cache/__dynamicProxys.js里边的东西都不一样，可以理解为 devTools工具的数据库
 */
const dynamicProxys = [
  {
    id: "20210327163619-c53e63410371",
    proxyPath: '/services/user/list',
    created: 1619855859359,
    modify:1619855859359,
    active: false,
    proxyConfig: {
      target: "http://192.168.100.224:8080",
      headers: {
        'user_id': '45906541'
      },
      pathRewrite: {
        '^/services': '/remote/server/path/service'
      },
    }
  }
]
module.exports = {
  defautSetting,
  dynamicProxys
};
