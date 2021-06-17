/*
 * Created Date: Monday June 7th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Monday June 7th 2021 12:47:30 am
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */

import { createRouter, createWebHashHistory } from 'vue-router'
// 路由懒加载
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    {
      path: '/home',
      name: 'home',
      component: ()=>import("@pages/Home/Home.vue"),
    },
    {
      path: '/proxy',
      name: 'proxy',
      component: ()=>import("@pages/Proxy/Proxy.vue"),
    }
  ],
})
export default router