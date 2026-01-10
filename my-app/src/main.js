import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Проверка аутентификации при запуске приложения
router.isReady().then(() => {
  const authStore = useAuthStore()
  authStore.checkAuth()
})

app.mount('#app')
