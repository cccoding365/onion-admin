import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    isDark: false,
    primaryColor: '#409EFF',
    isFullscreen: false,
    locale: 'zh-CN',
  }),
  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    toggleDark(val) {
      this.isDark = typeof val === 'boolean' ? val : !this.isDark
      this.applyTheme()
    },
    setPrimaryColor(color) {
      this.primaryColor = color
      this.applyTheme()
    },
    setLocale(locale) {
      this.locale = locale
    },
    applyTheme() {
      const root = document.documentElement
      // Dark mode via class on html for Element Plus dark vars
      root.classList.toggle('dark', this.isDark)
      // Primary color via CSS var override
      root.style.setProperty('--el-color-primary', this.primaryColor)
    },
    async toggleFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
          this.isFullscreen = true
        } else {
          await document.exitFullscreen()
          this.isFullscreen = false
        }
      } catch (e) {
        console.error('Fullscreen toggle error:', e)
      }
    },
  },
  persist: {
    key: 'onion-app',
    paths: ['collapsed', 'isDark', 'primaryColor', 'isFullscreen', 'locale'],
  },
})