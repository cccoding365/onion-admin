import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { username: 'admin', password: 'admin123', role: 'admin', nickname: 'Admin', avatar: '', age: 28, gender: 'male', createdAt: new Date().toISOString() },
      { username: 'user', password: 'user123', role: 'user', nickname: 'User', avatar: '', age: 24, gender: 'female', createdAt: new Date().toISOString() },
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
      const genders = ['male', 'female', 'other']
      const newUser = {
        username,
        password,
        role,
        nickname: username,
        avatar: '',
        age: Math.floor(18 + Math.random() * 30),
        gender: genders[Math.floor(Math.random() * genders.length)],
        createdAt: new Date().toISOString(),
      }
      this.users.push(newUser)
      // auto login after register
      this.currentUser = { username, role, nickname: newUser.nickname, avatar: '', age: newUser.age, gender: newUser.gender, createdAt: newUser.createdAt }
      this.roles = [role]
      this.token = Math.random().toString(36).slice(2)
    },
    login({ username, password }) {
      const found = this.users.find((u) => u.username === username && u.password === password)
      if (!found) throw new Error('Invalid username or password')
      this.currentUser = { username: found.username, role: found.role, nickname: found.nickname, avatar: found.avatar, age: found.age, gender: found.gender, createdAt: found.createdAt }
      this.roles = [found.role]
      this.token = Math.random().toString(36).slice(2)
    },
    logout() {
      this.currentUser = null
      this.roles = []
      this.token = null
    },
    updateProfile({ nickname, avatar, age, gender }) {
      if (!this.currentUser) throw new Error('Not logged in')
      const idx = this.users.findIndex((u) => u.username === this.currentUser.username)
      if (idx === -1) throw new Error('User not found')
      if (typeof nickname === 'string') this.users[idx].nickname = nickname
      if (typeof avatar === 'string') this.users[idx].avatar = avatar
      if (typeof age === 'number') this.users[idx].age = age
      if (typeof gender === 'string') this.users[idx].gender = gender
      this.currentUser.nickname = this.users[idx].nickname
      this.currentUser.avatar = this.users[idx].avatar
      this.currentUser.age = this.users[idx].age
      this.currentUser.gender = this.users[idx].gender
    },
    changePassword({ currentPassword, newPassword }) {
      if (!this.currentUser) throw new Error('Not logged in')
      const idx = this.users.findIndex((u) => u.username === this.currentUser.username)
      if (idx === -1) throw new Error('User not found')
      if (this.users[idx].password !== currentPassword) throw new Error('Current password incorrect')
      this.users[idx].password = newPassword
    },
    // Admin-only CRUD actions (mock)
    adminCreateUser({ username, password, role = 'user', nickname, avatar = '', age, gender }) {
      const exists = this.users.find((u) => u.username === username)
      if (exists) throw new Error('Username already exists')
      const newUser = { username, password, role, nickname: nickname || username, avatar, age: typeof age==='number'?age: Math.floor(18 + Math.random() * 30), gender: gender || 'other', createdAt: new Date().toISOString() }
      this.users.push(newUser)
      return newUser
    },
    adminDeleteUser(username) {
      const idx = this.users.findIndex((u) => u.username === username)
      if (idx === -1) throw new Error('User not found')
      const isCurrent = this.currentUser?.username === username
      this.users.splice(idx, 1)
      if (isCurrent) {
        this.logout()
      }
    },
    adminUpdateUser({ username, nickname, role, password, avatar, age, gender }) {
      const idx = this.users.findIndex((u) => u.username === username)
      if (idx === -1) throw new Error('User not found')
      if (typeof nickname === 'string') this.users[idx].nickname = nickname
      if (typeof role === 'string') this.users[idx].role = role
      if (typeof password === 'string') this.users[idx].password = password
      if (typeof avatar === 'string') this.users[idx].avatar = avatar
      if (typeof age === 'number') this.users[idx].age = age
      if (typeof gender === 'string') this.users[idx].gender = gender
      if (this.currentUser?.username === username) {
        this.currentUser.nickname = this.users[idx].nickname
        this.currentUser.avatar = this.users[idx].avatar
        this.roles = [this.users[idx].role]
        this.currentUser.age = this.users[idx].age
        this.currentUser.gender = this.users[idx].gender
      }
      return this.users[idx]
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