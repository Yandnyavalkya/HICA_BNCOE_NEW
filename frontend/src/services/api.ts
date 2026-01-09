import axios from 'axios'

// Use /api for Vercel deployment, or env variable, or localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:8000')

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('hica_token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('hica_token')
    delete api.defaults.headers.common.Authorization
  }
}

export function loadAuthTokenFromStorage() {
  const token = localStorage.getItem('hica_token')
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

loadAuthTokenFromStorage()


