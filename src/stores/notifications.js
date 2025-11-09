import { defineStore } from 'pinia'

// 支持的消息类型：仪表盘、侧栏、弹窗
const TYPES = ['dashboard', 'sidebar', 'modal']

function generateDefaultItems() {
  const now = new Date().toISOString()
  const rid = () => Math.random().toString(36).slice(2)
  return [
    { id: rid(), type: 'dashboard', content: '系统维护通知：今晚 23:00–02:00 进行版本升级，期间服务可能短暂不可用。', createdAt: now },
    { id: rid(), type: 'dashboard', content: '新功能上线：支持用户批量导入，请在「用户管理」页面查看使用说明。', createdAt: now },
    { id: rid(), type: 'sidebar', content: '安全提示：建议每 90 天更新一次密码，并开启两步验证保障账号安全。', createdAt: now },
    { id: rid(), type: 'modal', content: '重要提醒：检测到异常登录行为，请及时核查并修改密码。', createdAt: now },
    { id: rid(), type: 'dashboard', content: '运营公告：本月数据报表已更新，可在「仪表盘」查看最新趋势。', createdAt: now },
  ]
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    // 仪表盘显示与策略
    dashboardEnabled: true,
    dashboardStrategy: 'marquee', // 'marquee' | 'static' | 'autoClose'
    dashboardAutoCloseMs: 10000,

    // 全局通知设置：登录成功提示与回到应用提示
    globalLoginNotifyEnabled: true,
    globalReturnNotifyEnabled: true,

    // 历史与当前（按类型），默认空，由种子逻辑在首次使用时填充
    items: [], // { id, type, content, createdAt }
    currentId: null, // 兼容旧版本：仅仪表盘当前
    currentByType: { dashboard: null, sidebar: null, modal: null },
    seeded: false,
  }),
  getters: {
    // 兼容旧版本 current，等同于仪表盘当前
    current(state) {
      const id = state.currentByType.dashboard ?? state.currentId
      return state.items.find((n) => n.id === id) || null
    },
    currentDashboard(state) {
      const id = state.currentByType.dashboard ?? state.currentId
      return state.items.find((n) => n.id === id) || null
    },
  },
  actions: {
    seedDefaults() {
      if (!this.seeded && this.items.length === 0) {
        this.items = generateDefaultItems()
        this.seeded = true
      }
    },
    unsetCurrentByType(type) {
      const t = TYPES.includes(type) ? type : 'dashboard'
      this.currentByType[t] = null
      if (t === 'dashboard') this.currentId = null
    },
    add(content, type = 'dashboard') {
      const t = TYPES.includes(type) ? type : 'dashboard'
      const id = Math.random().toString(36).slice(2)
      const item = { id, type: t, content: String(content || '').trim(), createdAt: new Date().toISOString() }
      if (!item.content) return null
      this.items.unshift(item)
      // 不自动设为当前，是否设为当前由调用方决定
      return item
    },
    setCurrent(id) {
      const found = this.items.find((n) => n.id === id)
      if (found) {
        const t = TYPES.includes(found.type) ? found.type : 'dashboard'
        this.currentByType[t] = id
        if (t === 'dashboard') this.currentId = id
      }
    },
    setCurrentByType(type, id) {
      const t = TYPES.includes(type) ? type : 'dashboard'
      const found = this.items.find((n) => n.id === id && n.type === t)
      if (found) {
        this.currentByType[t] = id
        if (t === 'dashboard') this.currentId = id
      }
    },
    remove(id) {
      const idx = this.items.findIndex((n) => n.id === id)
      if (idx !== -1) {
        const removed = this.items[idx]
        const t = TYPES.includes(removed.type) ? removed.type : 'dashboard'
        const wasCurrent = (this.currentByType[t] === id) || (t === 'dashboard' && this.currentId === id)
        this.items.splice(idx, 1)
        if (wasCurrent) {
          this.currentByType[t] = null
          if (t === 'dashboard') this.currentId = null
        }
      }
    },
    setDashboardEnabled(val) {
      this.dashboardEnabled = !!val
    },
    setDashboardStrategy(val) {
      const allowed = ['marquee', 'static', 'autoClose']
      this.dashboardStrategy = allowed.includes(val) ? val : 'marquee'
    },
    setDashboardAutoCloseMs(ms) {
      const n = Number(ms)
      this.dashboardAutoCloseMs = Number.isFinite(n) && n >= 1000 ? n : 10000
    },
    setGlobalLoginNotifyEnabled(val) {
      this.globalLoginNotifyEnabled = !!val
    },
    setGlobalReturnNotifyEnabled(val) {
      this.globalReturnNotifyEnabled = !!val
    },
  },
  persist: {
    key: 'onion-notifications',
    paths: ['dashboardEnabled', 'dashboardStrategy', 'dashboardAutoCloseMs', 'globalLoginNotifyEnabled', 'globalReturnNotifyEnabled', 'items', 'currentByType', 'currentId', 'seeded'],
  },
})