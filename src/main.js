import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Router & Store
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'nprogress/nprogress.css'

// Theme override css vars
import './styles/theme.css'
// Global overrides for focus styles
import './styles/overrides.css'
import { i18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// Apply initial theme from store
import { useAppStore } from './stores/app'
const appStore = useAppStore()
appStore.applyTheme()

// 保证应用启动时 i18n 使用与 Pinia 中一致的语言
if (i18n.global?.locale) {
  // vue-i18n v9 在 legacy:false 下 locale 是一个 ref
  if ('value' in i18n.global.locale) {
    i18n.global.locale.value = appStore.locale
  } else {
    i18n.global.locale = appStore.locale
  }
}

// 订阅 Pinia 中的语言变化，立即同步到 i18n
appStore.$subscribe((mutation, state) => {
  if (i18n.global?.locale) {
    if ('value' in i18n.global.locale) {
      i18n.global.locale.value = state.locale
    } else {
      i18n.global.locale = state.locale
    }
  }
})

app.mount('#app')
