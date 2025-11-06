import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    visited: [], // { path, titleKey }
    active: '',
  }),
  actions: {
    addTab(route) {
      const path = route.path
      const titleKey = route.meta?.titleKey
      if (!this.visited.find((t) => t.path === path)) {
        this.visited.push({ path, titleKey })
      }
      this.active = path
    },
    removeTab(path) {
      const idx = this.visited.findIndex((t) => t.path === path)
      if (idx !== -1) {
        this.visited.splice(idx, 1)
      }
      if (this.active === path && this.visited.length) {
        this.active = this.visited[this.visited.length - 1].path
      }
    },
    setActive(path) {
      this.active = path
    },
    removeOthers(path) {
      this.visited = this.visited.filter((t) => t.path === path)
      this.active = path
    },
    removeAll() {
      this.visited = []
      this.active = ''
    },
  },
})