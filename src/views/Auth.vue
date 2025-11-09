<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const user = useUserStore()

const mode = ref('login') // 'login' | 'register'
const username = ref('')
const password = ref('')
// 记住账号密码
const remember = ref(false)
// 注册固定为普通用户
const role = ref('user')

function toggleMode() {
  const next = mode.value === 'login' ? 'register' : 'login'
  mode.value = next
  // 切换到注册时清空原本的输入内容，并确保角色固定为普通用户
  if (next === 'register') {
    username.value = ''
    password.value = ''
    role.value = 'user'
  }
}

async function submit() {
  try {
    if (mode.value === 'login') {
      await user.login({ username: username.value, password: password.value })
      // 登录成功后根据“记住我”选项保存或清理本地存储
      if (remember.value) {
        localStorage.setItem('onion_remember', '1')
        localStorage.setItem('onion_username', username.value)
        localStorage.setItem('onion_password', password.value)
      } else {
        localStorage.removeItem('onion_remember')
        localStorage.removeItem('onion_username')
        localStorage.removeItem('onion_password')
      }
      // 登录成功后提示（国际化）
      try {
        const hour = new Date().getHours()
        const key = hour < 5 ? 'notify.greeting.deepNight'
          : hour < 11 ? 'notify.greeting.morning'
          : hour < 13 ? 'notify.greeting.noon'
          : hour < 18 ? 'notify.greeting.afternoon'
          : 'notify.greeting.evening'
        const greeting = t(key)
        const role = user.currentUser?.role
        const baseName = user.currentUser?.nickname || user.currentUser?.username || ''
        const display = role && String(role).trim() ? `${role} ${baseName}` : baseName
        ElNotification({
          title: t('notify.loginSuccessTitle'),
          message: t('notify.loginSuccessMessage', { display, greeting, welcomeBack: t('notify.welcomeBack') }),
          position: 'top-right',
          type: 'success',
          duration: 4500,
          offset: 40,
        })
      } catch (e) {
        // 不影响后续跳转
        console.warn('Login notification failed:', e)
      }
    } else {
      // 注册时角色固定为普通用户
      role.value = 'user'
      await user.register({ username: username.value, password: password.value, role: role.value })
      // 注册成功后也提示（国际化）
      try {
        const hour = new Date().getHours()
        const key = hour < 5 ? 'notify.greeting.deepNight'
          : hour < 11 ? 'notify.greeting.morning'
          : hour < 13 ? 'notify.greeting.noon'
          : hour < 18 ? 'notify.greeting.afternoon'
          : 'notify.greeting.evening'
        const greeting = t(key)
        const roleCode = user.currentUser?.role
        const baseName = user.currentUser?.nickname || user.currentUser?.username || ''
        const display = roleCode && String(roleCode).trim() ? `${roleCode} ${baseName}` : baseName
        ElNotification({
          title: t('notify.loginSuccessTitle'),
          message: t('notify.loginSuccessMessage', { display, greeting, welcomeBack: t('notify.welcomeBack') }),
          position: 'top-right',
          type: 'success',
          duration: 4500,
          offset: 40,
        })
      } catch (e) {
        console.warn('Register notification failed:', e)
      }
    }
    router.push('/dashboard')
  } catch (e) {
    ElMessage.error(e?.message || String(e))
  }
}

// 初次加载时读取记住的账号密码
onMounted(() => {
  const saved = localStorage.getItem('onion_remember') === '1'
  remember.value = saved
  if (saved) {
    username.value = localStorage.getItem('onion_username') || ''
    password.value = localStorage.getItem('onion_password') || ''
  }
})
</script>

<template>
  <div class="auth-root">
    <!-- 品牌信息：LOGO + 名称 + 简介 -->
    <div class="brand">
      <img class="brand-logo" src="/vite.svg" alt="logo" />
      <div class="brand-text">
        <div class="brand-title">Onion Admin</div>
        <div class="brand-desc">轻量级后台管理模板</div>
      </div>
    </div>

    <!-- 翻转卡片容器 -->
    <div class="flip-scene" :class="{ flipped: mode==='register' }">
      <div class="flip-card">
        <!-- 登录卡片（正面） -->
        <div class="flip-face face-front">
          <el-card class="auth-card">
            <template #header>
              <div class="card-header">
                <span>{{ t('auth.login') }}</span>
                <el-link type="primary" @click="toggleMode">
                  {{ t('auth.switchToRegister') }}
                </el-link>
              </div>
            </template>
            <el-form label-position="top" @submit.prevent>
              <el-form-item :label="t('auth.username')">
                <el-input
                  v-model="username"
                  autocomplete="username"
                  :placeholder="t('auth.username')"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="t('auth.password')">
                <el-input
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  :placeholder="t('auth.password')"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="display:flex;align-items:center;justify-content:space-between;">
                  <el-checkbox v-model="remember">{{ t('auth.remember') }}</el-checkbox>
                </div>
              </el-form-item>
              <el-button type="primary" style="width:100%" @click="submit">
                {{ t('auth.login') }}
              </el-button>
            </el-form>
          </el-card>
        </div>

        <!-- 注册卡片（背面） -->
        <div class="flip-face face-back">
          <el-card class="auth-card">
            <template #header>
              <div class="card-header">
                <span>{{ t('auth.register') }}</span>
                <el-link type="primary" @click="toggleMode">
                  {{ t('auth.switchToLogin') }}
                </el-link>
              </div>
            </template>
            <el-form label-position="top" @submit.prevent>
              <el-form-item :label="t('auth.username')">
                <el-input
                  v-model="username"
                  autocomplete="username"
                  :placeholder="t('auth.username')"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="t('auth.password')">
                <el-input
                  v-model="password"
                  type="password"
                  autocomplete="new-password"
                  :placeholder="t('auth.password')"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <!-- 注册不展示角色选择，逻辑上固定为普通用户 -->
              <el-button type="primary" style="width:100%" @click="submit">
                {{ t('auth.register') }}
              </el-button>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.auth-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--el-color-info-light-9, #f5f7fa);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.brand-logo {
  width: 40px;
  height: 40px;
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-title {
  font-size: 18px;
  font-weight: 600;
}
.brand-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.flip-scene {
  perspective: 1200px;
  width: 380px;
  height: 360px; /* 保持高度一致避免翻转时跳动，避免按钮溢出 */
}
.flip-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}
.flipped .flip-card {
  transform: rotateY(180deg);
}
.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
}
.face-back {
  transform: rotateY(180deg);
}
.auth-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>