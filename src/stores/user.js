import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' },
    ],
    currentUser: null,
    token: null,
    roles: [],
  }),
  actions: {
    setRoles(roles) { this.roles = roles },
    register({ username, password, role }) {
      const exists = this.users.find((u) => u.username === username)
      if (exists) throw new Error('Username already exists')
      const newUser = { username, password, role }
      this.users.push(newUser)
      // auto login after register
      this.currentUser = { username, role }
      this.roles = [role]
      this.token = Math.random().toString(36).slice(2)
    },
    login({ username, password }) {
      const found = this.users.find((u) => u.username === username && u.password === password)
      if (!found) throw new Error('Invalid username or password')
      this.currentUser = { username: found.username, role: found.role }
      this.roles = [found.role]
      this.token = Math.random().toString(36).slice(2)
    },
    logout() {
      this.currentUser = null
      this.roles = []
      this.token = null
    },
    hasAccess(route) {
      const req = route.meta?.roles
      if (!req || req.length === 0) return true
      return this.roles.some((r) => req.includes(r))
    },
  },
  persist: {
    key: 'onion-user',
    paths: ['users', 'currentUser', 'token', 'roles'],
  },
})