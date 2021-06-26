import { createI18n, VueMessageType } from 'vue-i18n';
import enLocale from 'element-plus/lib/locale/lang/en';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';
import { getCookie, addCookie} from '@/utils/cookie';

const messages:any = {
  [enLocale.name]: {
    el: enLocale.el,
    common: {
      confirm: 'confirm',
      remind: 'message',
    },
    message: {
      home_mock: 'mock data',
      home_proxy: 'proxy',
      home_proxy_go: 'setting',
      proxy_setting: 'Proxy Setting',
      proxy_path: 'proxy path',
      proxy_enable: 'enable',
      proxy_conf: 'proxy config',
      proxy_btn_try: 'try it out',
      proxy_btn_modify: 'modify',
      proxy_btn_cancel: 'cancel',
      proxy_btn_commit_modify: 'commit modify',
      proxy_btn_add: 'add a proxy rule',
      proxy_btn_confirm_add: 'commit add',
      proxy_result_to: 'it proxy to following',
      proxy_conf_format: 'config expect a JSON format data, please check your config!',
    },
  },
  [zhLocale.name]: {
    el: zhLocale.el,
    common: {
      confirm: '确 认',
      remind: '提示',
    },
    message: {
      home_mock: 'mock数据',
      home_proxy: '代理配置',
      home_proxy_go: '配置',
      proxy_setting: '代理设置',
      proxy_path: '代理路径',
      proxy_enable: '启用状态',
      proxy_conf: '代理配置',
      proxy_btn_try: '尝试',
      proxy_btn_modify: '修改',
      proxy_btn_cancel: '取消修改',
      proxy_btn_commit_modify: '确认修改',
      proxy_btn_add: '新增代理',
      proxy_btn_confirm_add: '确认新增',
      proxy_result_to: '代理到了',
      proxy_conf_format: '配置为正规的JSON格式，请先校验正确性！'
    },
  }
}
export function getLanguage() {
  const chooseLanguage = getCookie('language');
  if (chooseLanguage) return chooseLanguage;
  const language = (navigator.language).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}

export default createI18n({
  locale: getLanguage(),
  fallbackLocale: enLocale.name,
  messages,
})