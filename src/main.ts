import {createApp} from 'vue';
import App from './App.vue'
import router from './router'
import store from './store';
import Element from 'element-plus';
// import lang from 'element-plus/lib/locale/lang/zh-cn'
// import locale from 'element-plus/lib/locale'
import "element-plus/lib/theme-chalk/index.css";
import './assets/css/global.css';
import i18n from './lang/i18n';
// import locale from 'element-plus/lib/locale/lang/zh-cn'
const app = createApp(App);

app
  .use(router)
  .use(store)
  .use(Element, { 
    size: "medium",
    i18n: i18n.global.t,
  })
  .use(i18n)
  .mount('#app') // 将页面挂载到 root 节点