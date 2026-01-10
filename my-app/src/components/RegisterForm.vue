<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister">
      <h2>Регистрация</h2>
      
      <div v-if="store.error" class="error">{{ store.error }}</div>
      
      <div class="form-group">
        <label for="reg-username">Имя пользователя:</label>
        <input
          id="reg-username"
          v-model="username"
          type="text"
          required
          :disabled="store.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="reg-email">Email:</label>
        <input
          id="reg-email"
          v-model="email"
          type="email"
          required
          :disabled="store.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="reg-password">Пароль:</label>
        <input
          id="reg-password"
          v-model="password"
          type="password"
          required
          :disabled="store.loading"
        />
      </div>
      
      <div class="form-group">
        <label for="reg-confirm-password">Подтвердите пароль:</label>
        <input
          id="reg-confirm-password"
          v-model="confirmPassword"
          type="password"
          required
          :disabled="store.loading"
        />
      </div>
      
      <button type="submit" :disabled="store.loading">
        {{ store.loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
      
      <p>
        Уже есть аккаунт?
        <router-link to="/login">Войти</router-link>
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    store.error = 'Пароли не совпадают'
    return
  }
  
  const result = await store.register(username.value, email.value, password.value)
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.register-form {
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
  background-color: #28a745;
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