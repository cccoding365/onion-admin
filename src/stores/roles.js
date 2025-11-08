import { defineStore } from 'pinia'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [
      {
        code: 'admin',
        name: '管理员',
        description: '系统管理员，拥有全部权限',
        permissions: [
          'dashboard:view',
          'users:manage',
          'roles:manage',
          'permissions:manage',
          'departments:manage',
          'menus:manage',
          'logs:view',
          'settings:manage',
          'tasks:manage',
          'notifications:manage',
          'files:manage',
          'dicts:manage',
        ],
        enabled: true,
        builtIn: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        code: 'user',
        name: '普通用户',
        description: '普通用户，拥有基础浏览权限',
        permissions: ['dashboard:view'],
        enabled: true,
        builtIn: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }),
  getters: {
    roleCodes: (state) => state.roles.map((r) => r.code),
  },
  actions: {
    createRole({ code, name, description, permissions = [], enabled = true }) {
      if (!code || !name) throw new Error('角色编码与名称为必填项')
      const exists = this.roles.find((r) => r.code === code)
      if (exists) throw new Error('角色编码已存在')
      const now = new Date().toISOString()
      const role = {
        code,
        name,
        description: description || '',
        permissions: Array.isArray(permissions) ? permissions : [],
        enabled: !!enabled,
        builtIn: false,
        createdAt: now,
        updatedAt: now,
      }
      this.roles.push(role)
      return role
    },
    updateRole({ code, name, description, permissions, enabled }) {
      const idx = this.roles.findIndex((r) => r.code === code)
      if (idx === -1) throw new Error('角色不存在')
      if (typeof name === 'string') this.roles[idx].name = name
      if (typeof description === 'string') this.roles[idx].description = description
      if (Array.isArray(permissions)) this.roles[idx].permissions = permissions
      if (typeof enabled === 'boolean') this.roles[idx].enabled = enabled
      this.roles[idx].updatedAt = new Date().toISOString()
      return this.roles[idx]
    },
    deleteRole(code) {
      const idx = this.roles.findIndex((r) => r.code === code)
      if (idx === -1) throw new Error('角色不存在')
      if (this.roles[idx].builtIn) throw new Error('内置角色不可删除')
      this.roles.splice(idx, 1)
    },
  },
  persist: {
    key: 'onion-roles',
    paths: ['roles'],
  },
})