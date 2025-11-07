import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    app: {
      title: 'Onion Admin',
    },
    menu: {
      dashboard: '仪表盘',
      about: '关于',
      admin: '管理',
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
    auth: {
      login: '登录',
      register: '注册',
      switchToRegister: '没有账号？注册',
      switchToLogin: '已有账号？登录',
      username: '账号',
      password: '密码',
      role: '角色',
      admin: '管理员',
      user: '普通用户',
      forbidden: '访问被拒绝（403）',
      logout: '退出登录',
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
      admin: 'Admin',
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
    auth: {
      login: 'Login',
      register: 'Register',
      switchToRegister: "New here? Register",
      switchToLogin: 'Have an account? Login',
      username: 'Username',
      password: 'Password',
      role: 'Role',
      admin: 'Admin',
      user: 'User',
      forbidden: 'Access Denied (403)',
      logout: 'Logout',
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