<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Дашборд результатов соревнований</h1>
      <div class="user-info">
        Добро пожаловать, {{ authStore.user?.username }}!
        <button @click="logout" class="logout-btn">Выйти</button>
      </div>
    </header>

    <main class="dashboard-content">
      <section class="filters">
        <h2>Фильтры</h2>

        <div class="filter-row">
          <div class="filter-group">
            <label for="participant">Участник:</label>
            <select id="participant" v-model="filters.participant_id">
              <option value="">Все участники</option>
              <option v-for="participant in participants" :key="participant.id" :value="participant.id">
                {{ participant.full_name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="competition">Соревнование:</label>
            <select id="competition" v-model="filters.competition_id">
              <option value="">Не выбрано</option>
              <option v-for="competition in competitions" :key="competition.id" :value="competition.id">
                {{ formatDate(competition.date) }} - "{{ competition.name}}"
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="birth-year">Год рождения:</label>
            <select id="birth-year" v-model="filters.birth_year">
              <option value="">Все годы</option>
              <option v-for="year in yearOptions" :key="year" :value=year>
                {{ year }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="discipline">Дисциплина:</label>
            <select id="discipline" v-model="filters.discipline_id">
              <option value="">Все дисциплины</option>
              <option v-for="disc in disciplines" :key="disc.id" :value="disc.id">
                {{ disc.name }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="results">
        <h2>Результаты</h2>
        <div v-if="loading" class="loading">Загрузка результатов...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="results-table-container">
          <table class="results-table">
            <thead>
            <tr>
              <th>Дата соревнования</th>
              <th>Участник</th>
              <th>Год рождения</th>
              <th>Дисциплина</th>
              <th>Результат</th>
              <th>Место</th>
              <th>Изменение</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="result in results" :key="result.id">
              <td>{{ formatDate(result.competition.date) }}</td>
              <td>{{ result.participant.full_name }}</td>
              <td>{{ result.participant.birth_year }}</td>
              <td>{{ result.discipline.name }}</td>
              <td>
                {{ formatResult(result.result, result.discipline) }}
                <strong v-if="result.result_additional">({{ formatResult(result.result_additional, result.discipline) }})</strong>
              </td>
              <td>{{ result.place }}</td>
              <td>{{ formatResult(result.change_value, result.discipline) }}</td>

            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="protocol-upload">
        <h2>Загрузка протокола</h2>
        <div class="upload-area" @dragover.prevent @drop="handleDrop">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept=".csv,.xlsx,.xls"
            style="display: none;"
          />
          <div class="upload-content" @click="selectFile">
            <p>Перетащите файл сюда или кликните для выбора</p>
            <p class="file-format-info">Поддерживаемые форматы: CSV, XLSX, XLS</p>
          </div>
        </div>
        <div v-if="uploadStatus" :class="['upload-status', uploadStatus.type]">
          {{ uploadStatus.message }}
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="js">
import {onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import apiService from '@/services/api'
import {formatDate, formatResult} from "@/utils/format.js";

// Глобальные объекты, используемые в компоненте
/* global console, setTimeout */

const router = useRouter()
const authStore = useAuthStore()

// Модель фильтров
const filters = ref({
  participant_id: '',
  competition_id: '',
  birth_year: '',
  discipline_id: ''
})

// Состояния для данных
const results = ref([])
const disciplines = ref([])
const competitions = ref([])
const participants = ref([])

const loading = ref(false)
const error = ref(null)

// Генерация диапазона лет для выбора
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({length: 11}, (_, i) => currentYear - 8 - i)

// Загрузка результатов с учетом фильтров
const loadResults = async () => {
  loading.value = true
  error.value = null

  try {
    const params = {
      participant: filters.value.participant_id || undefined,
      competition: filters.value.competition_id || undefined,
      birth_year: filters.value.birth_year || undefined,
      discipline: filters.value.discipline_id || undefined
    }

    const data = await apiService.getCompetitionResults(params)
    results.value = data.results || data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки результатов'
  } finally {
    loading.value = false
  }
}

// Загрузка дисциплин
const loadDisciplines = async () => {
  try {
    disciplines.value = await apiService.getDisciplines()
  } catch (err) {
    console.error('Ошибка загрузки дисциплин:', err)

  }
}
// Загрузка Соревнований
const loadCompetitions = async () => {
  try {
    competitions.value = await apiService.getCompetitions()
  } catch (err) {
    console.error('Ошибка загрузки соревнований:', err)
  }
}
// Загрузка участников
const loadParticipants = async () => {
  try {
    const params = {
      participant: filters.value.participant_id || undefined,
      competition: filters.value.competition_id || undefined,
      birth_year: filters.value.birth_year || undefined,
      discipline: filters.value.discipline_id || undefined
    }
    participants.value = await apiService.getParticipants(params)
  } catch (err) {
    console.error('Ошибка загрузки участников:', err)
  }
}

// Наблюдаем за изменениями фильтров и загружаем новые данные
watch(filters, () => {
  loadParticipants()
  loadResults()
}, {deep: true})

// Функция выхода
const logout = async () => {
  await authStore.logout()
  await router.push('/login')
}

// Загрузка файла
const fileInput = ref()
const uploadStatus = ref(null)

const selectFile = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const target = event.target
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      validateAndUploadFile(file)
    }
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) {
      validateAndUploadFile(file)
    }
  }
}

const validateAndUploadFile = async (file) => {
  // Проверка формата файла
  const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['csv', 'xls', 'xlsx']

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
    uploadStatus.value = {
      type: 'error',
      message: 'Недопустимый формат файла. Разрешены только CSV, XLS и XLSX.'
    }
    return
  }

  try {
    const response = await apiService.uploadProtocol(file)
    uploadStatus.value = {
      type: 'success',
      message: response.message || `Файл "${file.name}" успешно загружен и проверен.`
    }
  } catch (err) {
    uploadStatus.value = {
      type: 'error',
      message: err instanceof Error ? err.message : 'Ошибка загрузки файла'
    }
  }

  // Сброс статуса через 3 секунды
  setTimeout(() => {
    uploadStatus.value = null
  }, 3000)
}

onMounted(async () => {
  // Проверяем аутентификацию при монтировании компонента
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }

  // Загружаем начальные данные
  await loadParticipants()
  await loadDisciplines()
  await loadCompetitions()
  await loadResults()


})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.results {
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 1rem 0;
}

.results-table-container {
  overflow-x: auto;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.results-table th,
.results-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.results-table th {
  background-color: #181818;
  font-weight: bold;
}

.positive-change {
  color: green;
  font-weight: bold;
}

.negative-change {
  color: red;
  font-weight: bold;
}

.protocol-upload {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #007bff;
}

.file-format-info {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.upload-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.upload-status.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.upload-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
