<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const user = useUserStore()

const mode = ref('login') // 'login' | 'register'
const username = ref('')
const password = ref('')
const role = ref('user')
// const error = ref('')

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  // error.value = ''
}

async function submit() {
  // error.value = ''
  try {
    if (mode.value === 'login') {
      await user.login({ username: username.value, password: password.value })
    } else {
      await user.register({ username: username.value, password: password.value, role: role.value })
    }
    router.push('/dashboard')
  } catch (e) {
    ElMessage.error(e?.message || String(e))
    // error.value = e?.message || String(e)
  }
}
</script>

<template>
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;">
    <el-card style="width:360px;">
      <template #header>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span>{{ mode==='login' ? t('auth.login') : t('auth.register') }}</span>
          <el-link type="primary" @click="toggleMode">
            {{ mode==='login' ? t('auth.switchToRegister') : t('auth.switchToLogin') }}
          </el-link>
        </div>
      </template>

      <el-form label-position="top" @submit.prevent>
        <el-form-item :label="t('auth.username')">
          <el-input v-model="username" autocomplete="username" />
        </el-form-item>
        <el-form-item :label="t('auth.password')">
          <el-input v-model="password" type="password" autocomplete="current-password" />
        </el-form-item>
        <el-form-item v-if="mode==='register'" :label="t('auth.role')">
          <el-select v-model="role" style="width:100%">
            <el-option :label="t('auth.admin')" value="admin" />
            <el-option :label="t('auth.user')" value="user" />
          </el-select>
        </el-form-item>

        <!-- <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom:12px;" /> -->

        <el-button type="primary" style="width:100%" @click="submit">
          {{ mode==='login' ? t('auth.login') : t('auth.register') }}
        </el-button>
      </el-form>
    </el-card>
  </div>
  
</template>

<style scoped>
</style>