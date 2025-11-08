<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRolesStore } from '../stores/roles'

const { t } = useI18n({ useScope: 'global' })
const roles = useRolesStore()

const permissionOptions = [
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
]

const filters = reactive({ keyword: '', onlyEnabled: false })
const filteredRoles = computed(() => {
  return (roles.roles || []).filter((r) => {
    const kw = filters.keyword.trim().toLowerCase()
    const matchKw = !kw || r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw)
    const matchEnabled = !filters.onlyEnabled || !!r.enabled
    return matchKw && matchEnabled
  })
})

const editing = ref(null) // code of role being edited
const editForm = reactive({ code: '', name: '', description: '', permissions: [], enabled: true })

function startEdit(row) {
  editing.value = row.code
  editForm.code = row.code
  editForm.name = row.name
  editForm.description = row.description
  editForm.permissions = [...(row.permissions || [])]
  editForm.enabled = !!row.enabled
}
function cancelEdit() {
  editing.value = null
}
function saveEdit() {
  try {
    roles.updateRole({
      code: editForm.code,
      name: editForm.name,
      description: editForm.description,
      permissions: editForm.permissions,
      enabled: editForm.enabled,
    })
    ElMessage.success(t('rolesPage.saved'))
    editing.value = null
  } catch (e) {
    ElMessage.error(e?.message || String(e))
  }
}
function remove(row) {
  ElMessageBox.confirm(
    t('rolesPage.deleteConfirm', { code: row.code }),
    t('rolesPage.deleteTitle'),
    { type: 'warning' }
  )
    .then(() => {
      roles.deleteRole(row.code)
      ElMessage.success(t('rolesPage.deleted'))
    })
    .catch(() => {})
}

// Create dialog
const showCreate = ref(false)
const createForm = reactive({ code: '', name: '', description: '', permissions: [], enabled: true })
function openCreate() {
  showCreate.value = true
  createForm.code = ''
  createForm.name = ''
  createForm.description = ''
  createForm.permissions = []
  createForm.enabled = true
}
function submitCreate() {
  try {
    if (!createForm.code || !createForm.name) {
      throw new Error(t('rolesPage.required'))
    }
    roles.createRole({
      code: createForm.code.trim(),
      name: createForm.name.trim(),
      description: createForm.description.trim(),
      permissions: createForm.permissions,
      enabled: createForm.enabled,
    })
    showCreate.value = false
    ElMessage.success(t('rolesPage.created'))
  } catch (e) {
    ElMessage.error(e?.message || String(e))
  }
}
</script>

<template>
  <el-card>
    <template #header>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <span>{{ t('menu.roles') }}</span>
        <el-button type="primary" @click="openCreate">{{ t('rolesPage.createRole') }}</el-button>
      </div>
    </template>

    <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
      <el-input v-model="filters.keyword" :placeholder="t('rolesPage.searchPlaceholder')" style="width:240px" />
      <el-checkbox v-model="filters.onlyEnabled">{{ t('rolesPage.onlyEnabled') }}</el-checkbox>
      <el-button @click="filters.keyword='';filters.onlyEnabled=false">{{ t('common.reset') }}</el-button>
    </div>

    <el-table :data="filteredRoles" border style="width:100%">
      <el-table-column type="index" :index="(n)=>n+1" width="60" />
      <el-table-column :label="t('rolesPage.name')" prop="name" width="200">
        <template #default="{ row }">
          <div v-if="editing === row.code">
            <el-input v-model="editForm.name" size="small" />
          </div>
          <div v-else>{{ row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.code')" prop="code" width="160" />
      <el-table-column :label="t('rolesPage.permissions')" min-width="260">
        <template #default="{ row }">
          <div v-if="editing === row.code" style="display:flex;align-items:center;gap:8px;">
            <el-select v-model="editForm.permissions" multiple size="small" style="min-width:240px">
              <el-option v-for="p in permissionOptions" :key="p" :label="p" :value="p" />
            </el-select>
          </div>
          <div v-else style="display:flex;flex-wrap:wrap;gap:6px;">
            <el-tag v-for="p in row.permissions" :key="p">{{ p }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.description')" min-width="220">
        <template #default="{ row }">
          <div v-if="editing === row.code">
            <el-input v-model="editForm.description" size="small" />
          </div>
          <div v-else>{{ row.description }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.enabled')" width="120">
        <template #default="{ row }">
          <div v-if="editing === row.code">
            <el-switch v-model="editForm.enabled" />
          </div>
          <div v-else>
            <el-tag type="success" v-if="row.enabled">{{ t('common.yes') || 'Yes' }}</el-tag>
            <el-tag type="warning" v-else>{{ t('common.no') || 'No' }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.createdAt')" width="180">
        <template #default="{ row }">{{ (row.createdAt || '').slice(0,16).replace('T',' ') }}</template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.updatedAt')" width="180">
        <template #default="{ row }">{{ (row.updatedAt || '').slice(0,16).replace('T',' ') }}</template>
      </el-table-column>
      <el-table-column :label="t('rolesPage.actions')" fixed="right" min-width="160">
        <template #default="{ row }">
          <div v-if="editing === row.code" style="display:flex;gap:8px">
            <el-button type="primary" size="small" @click="saveEdit">{{ t('rolesPage.save') }}</el-button>
            <el-button size="small" @click="cancelEdit">{{ t('rolesPage.cancel') }}</el-button>
          </div>
          <div v-else style="display:flex;gap:8px">
            <el-button type="primary" size="small" @click="startEdit(row)">{{ t('rolesPage.edit') }}</el-button>
            <el-button v-if="!row.builtIn" type="danger" size="small" @click="remove(row)">{{ t('rolesPage.delete') }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showCreate" :title="t('rolesPage.createRole')" width="520px">
      <el-form label-position="top">
        <el-form-item :label="t('rolesPage.code')">
          <el-input v-model="createForm.code" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('rolesPage.name')">
          <el-input v-model="createForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('rolesPage.description')">
          <el-input v-model="createForm.description" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('rolesPage.permissions')">
          <el-select v-model="createForm.permissions" multiple style="width:100%">
            <el-option v-for="p in permissionOptions" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('rolesPage.enabled')">
          <el-switch v-model="createForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate=false">{{ t('rolesPage.cancel') }}</el-button>
        <el-button type="primary" @click="submitCreate">{{ t('rolesPage.create') }}</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped>
</style>