import {useAuthStore} from '@/stores/auth'

class ApiService {
  baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

  // Общий метод для выполнения запросов с авторизацией
  async request(endpoint, options = {}) {
    const authStore = useAuthStore()

    // Проверяем, если в options.body используется FormData, не устанавливаем Content-Type
    const isFormData = options.body instanceof FormData

    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    }

    // Устанавливаем Content-Type только если это не FormData
    if (!isFormData) {
      (config.headers)['Content-Type'] = 'application/json'
    }

    // Добавляем токен авторизации, если пользователь аутентифицирован
    if (authStore.token) {
      (config.headers)['Authorization'] = `Token ${authStore.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (response.status === 401) {
      // Токен истек, выполняем выход
      authStore.logout()
      window.location.href = '/login'
      throw new Error('Требуется авторизация')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Аутентификация
  async login(credentials) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout/', {
      method: 'POST',
    })
  }

  // Работа с результатами соревнований
  async getCompetitionResults(params) {
    const queryParams = new URLSearchParams()

    if (params?.participant) queryParams.append('participant', params.participant)
    if (params?.birth_year) queryParams.append('birth_year', params.birth_year)
    if (params?.discipline) queryParams.append('discipline', params.discipline)
    if (params?.competition) queryParams.append('competition', params.competition)

    const queryString = queryParams.toString()
    const endpoint = `/results/${queryString ? '?' + queryString : ''}`

    return this.request(endpoint)
  }


  // Загрузка протокола
  async uploadProtocol(file) {
    const formData = new FormData()
    formData.append('protocol_file', file)

    // Для multipart запроса не указываем Content-Type, браузер установит его автоматически
    const config = {
      method: 'POST',
      body: formData
    }

    // Удаляем Content-Type из заголовков, чтобы браузер установил его автоматически
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers = {
        'Authorization': `Token ${authStore.token}`
      }
    }

    const endpoint = '/protocols/upload/'
    return this.request(endpoint, config)
  }

  // Получение информации о дисциплинах
  async getDisciplines() {
    const endpoint = '/disciplines/'
    return this.request(endpoint)
  }

  // Получение информации о соревнованиях
  async getCompetitions() {
    const endpoint = '/competitions/'
    return this.request(endpoint)
  }

  // Получение информации об участниках
  async getParticipants(params) {
    const queryParams = new URLSearchParams()
    if (params?.birth_year) queryParams.append('birth_year', params.birth_year)
    const queryString = queryParams.toString()
    const endpoint = `/participants/${queryString ? '?' + queryString : ''}`
    return this.request(endpoint)
  }
}

export default new ApiService()
