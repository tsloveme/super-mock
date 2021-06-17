import {createApp} from 'vue';
import App from './App.vue'
import router from './router'
import store from './store';
import Element from 'element-plus';
import "element-plus/lib/theme-chalk/index.css";
import './assets/css/global.css';

const app = createApp(App);
app
  .use(router)
  .use(store)
  .use(Element, { size: "medium" })
  .mount('#app') // 将页面挂载到 root 节点