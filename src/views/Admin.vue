<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

const { t } = useI18n({ useScope: 'global' })
const user = useUserStore()

const editing = ref(null) // username of the row being edited
const editForm = reactive({ username: '', nickname: '', role: 'user' })

function startEdit(row) {
  editing.value = row.username
  editForm.username = row.username
  editForm.nickname = row.nickname
  editForm.role = row.role
}

function cancelEdit() {
  editing.value = null
}

function saveEdit() {
  try {
    user.adminUpdateUser({ username: editForm.username, nickname: editForm.nickname, role: editForm.role })
    ElMessage.success(t('adminPage.saved'))
    editing.value = null
  } catch (e) {
    ElMessage.error(e?.message || String(e))
  }
}

function remove(row) {
  ElMessageBox.confirm(t('adminPage.deleteConfirm', { username: row.username }), t('adminPage.deleteTitle'), {
    type: 'warning',
  })
    .then(() => {
      user.adminDeleteUser(row.username)
      ElMessage.success(t('adminPage.deleted'))
    })
    .catch(() => {})
}

// Create dialog
const showCreate = ref(false)
const createForm = reactive({ username: '', password: '', nickname: '', role: 'user' })

function openCreate() {
  showCreate.value = true
  createForm.username = ''
  createForm.password = ''
  createForm.nickname = ''
  createForm.role = 'user'
}

function submitCreate() {
  try {
    if (!createForm.username || !createForm.password) {
      throw new Error(t('adminPage.required'))
    }
    user.adminCreateUser({
      username: createForm.username,
      password: createForm.password,
      role: createForm.role,
      nickname: createForm.nickname || createForm.username,
    })
    showCreate.value = false
    ElMessage.success(t('adminPage.created'))
  } catch (e) {
    ElMessage.error(e?.message || String(e))
  }
}
</script>

<template>
  <div class="admin-page">
    <el-card>
      <template #header>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span>{{ t('menu.admin') }}</span>
          <el-button type="primary" @click="openCreate">{{ t('adminPage.createUser') }}</el-button>
        </div>
      </template>

      <el-table :data="user.users" border style="width: 100%">
        <el-table-column :label="t('adminPage.username')" prop="username" width="180" />
        <el-table-column :label="t('adminPage.nickname')" width="220">
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-input v-model="editForm.nickname" size="small" />
            </div>
            <div v-else>{{ row.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('adminPage.role')" width="200">
          <template #default="{ row }">
            <div v-if="editing === row.username" style="display:flex;align-items:center;gap:8px;">
              <el-select v-model="editForm.role" size="small" style="width:120px;">
                <el-option :label="t('auth.admin')" value="admin" />
                <el-option :label="t('auth.user')" value="user" />
              </el-select>
            </div>
            <div v-else>
              <el-tag type="success" v-if="row.role==='admin'">{{ t('auth.admin') }}</el-tag>
              <el-tag v-else>{{ t('auth.user') }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('adminPage.actions')">
          <template #default="{ row }">
            <div v-if="editing === row.username" style="display:flex;gap:8px;">
              <el-button type="primary" size="small" @click="saveEdit">{{ t('adminPage.save') }}</el-button>
              <el-button size="small" @click="cancelEdit">{{ t('adminPage.cancel') }}</el-button>
            </div>
            <div v-else style="display:flex;gap:8px;">
              <el-button type="primary" size="small" @click="startEdit(row)">{{ t('adminPage.edit') }}</el-button>
              <el-button type="danger" size="small" @click="remove(row)">{{ t('adminPage.delete') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showCreate" :title="t('adminPage.createUser')" width="480px">
      <el-form label-position="top">
        <el-form-item :label="t('adminPage.username')">
          <el-input v-model="createForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('auth.password')">
          <el-input v-model="createForm.password" type="password" autocomplete="new-password" />
        </el-form-item>
        <el-form-item :label="t('adminPage.nickname')">
          <el-input v-model="createForm.nickname" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('adminPage.role')">
          <el-select v-model="createForm.role" style="width:100%">
            <el-option :label="t('auth.admin')" value="admin" />
            <el-option :label="t('auth.user')" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate=false">{{ t('adminPage.cancel') }}</el-button>
        <el-button type="primary" @click="submitCreate">{{ t('adminPage.create') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>