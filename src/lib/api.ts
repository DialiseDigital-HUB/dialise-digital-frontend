import axios from 'axios'
import useAuthStore from '../store/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().usuario?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (erro) => {
    if (erro.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(erro)
  },
)

export default api
