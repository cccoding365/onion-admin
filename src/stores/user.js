import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    roles: ['admin'],
  }),
  actions: {
    setRoles(roles) {
      this.roles = roles
    },
    hasAccess(route) {
      const req = route.meta?.roles
      if (!req || req.length === 0) return true
      return this.roles.some((r) => req.includes(r))
    },
  },
})