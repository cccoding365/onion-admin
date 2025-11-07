import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    app: {
      title: 'Onion Admin',
    },
    menu: {
      dashboard: '仪表盘',
      about: '关于',
    },
    actions: {
      dark: '暗色',
      light: '亮色',
      fullscreen: '全屏',
      collapse: '折叠',
    },
    tabs: {
      close: '关闭',
      closeOthers: '关闭其他',
      closeAll: '关闭全部',
    },
    breadcrumb: {
      home: '首页',
    },
    footer: {
      copyright: '© 2023 Onion Admin. All Rights Reserved.',
    },
  },
  en: {
    app: {
      title: 'Onion Admin',
    },
    menu: {
      dashboard: 'Dashboard',
      about: 'About',
    },
    actions: {
      dark: 'Dark',
      light: 'Light',
      fullscreen: 'Fullscreen',
      collapse: 'Collapse',
    },
    tabs: {
      close: 'Close',
      closeOthers: 'Close Others',
      closeAll: 'Close All',
    },
    breadcrumb: {
      home: 'Home',
    },
    footer: {
      copyright: '© 2023 Onion Admin. All Rights Reserved.',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  // 默认语言使用中文，实际语言将由入口处与 Pinia 状态同步
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages,
})