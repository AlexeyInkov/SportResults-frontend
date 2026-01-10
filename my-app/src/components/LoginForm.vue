<template>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <h2>Вход</h2>

      <div v-if="store.error" class="error">{{ store.error }}</div>

      <div class="form-group">
        <label for="username">Имя пользователя:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          :disabled="store.loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          :disabled="store.loading"
        />
      </div>

      <button type="submit" :disabled="store.loading">
        {{ store.loading ? 'Вход...' : 'Войти' }}
      </button>

      <p>
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const store = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await store.login(username.value, password.value)
  if (result.success) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

p {
  margin-top: 1rem;
  text-align: center;
}
</style>
