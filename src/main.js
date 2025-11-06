import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Router & Store
import router from './router'
import { createPinia } from 'pinia'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// Theme override css vars
import './styles/theme.css'
import { i18n } from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(i18n)

// Apply initial theme from store
import { useAppStore } from './stores/app'
const appStore = useAppStore()
appStore.applyTheme()

app.mount('#app')
