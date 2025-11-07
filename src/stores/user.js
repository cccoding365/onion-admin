import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { username: 'admin', password: 'admin123', role: 'admin', nickname: 'Admin', avatar: '' },
      { username: 'user', password: 'user123', role: 'user', nickname: 'User', avatar: '' },
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
      const newUser = { username, password, role, nickname: username, avatar: '' }
      this.users.push(newUser)
      // auto login after register
      this.currentUser = { username, role, nickname: newUser.nickname, avatar: '' }
      this.roles = [role]
      this.token = Math.random().toString(36).slice(2)
    },
    login({ username, password }) {
      const found = this.users.find((u) => u.username === username && u.password === password)
      if (!found) throw new Error('Invalid username or password')
      this.currentUser = { username: found.username, role: found.role, nickname: found.nickname, avatar: found.avatar }
      this.roles = [found.role]
      this.token = Math.random().toString(36).slice(2)
    },
    logout() {
      this.currentUser = null
      this.roles = []
      this.token = null
    },
    updateProfile({ nickname, avatar }) {
      if (!this.currentUser) throw new Error('Not logged in')
      const idx = this.users.findIndex((u) => u.username === this.currentUser.username)
      if (idx === -1) throw new Error('User not found')
      if (typeof nickname === 'string') this.users[idx].nickname = nickname
      if (typeof avatar === 'string') this.users[idx].avatar = avatar
      this.currentUser.nickname = this.users[idx].nickname
      this.currentUser.avatar = this.users[idx].avatar
    },
    changePassword({ currentPassword, newPassword }) {
      if (!this.currentUser) throw new Error('Not logged in')
      const idx = this.users.findIndex((u) => u.username === this.currentUser.username)
      if (idx === -1) throw new Error('User not found')
      if (this.users[idx].password !== currentPassword) throw new Error('Current password incorrect')
      this.users[idx].password = newPassword
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