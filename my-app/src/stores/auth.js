import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '@/services/api'


export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Авторизация
  const login = async (username, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.login({ username, password })

      user.value = {'user_id': response.user_id, 'username': response.username}
      token.value = response.token
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      isAuthenticated.value = true

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка авторизации'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Регистрация
  const register = async (username, email, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.register({ username, email, password })

      user.value = response.user
      token.value = response.token
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      isAuthenticated.value = true

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка регистрации'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Выход
  const logout = async () => {
    await apiService.logout().catch(() => {})

    user.value = null
    token.value = null
    localStorage.removeItem('token')
    isAuthenticated.value = false
  }

  // Проверка аутентификации
  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      // В реальном приложении здесь бы делался запрос для получения данных пользователя
      // user.value = await apiService.getCurrentUser()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  }
})
