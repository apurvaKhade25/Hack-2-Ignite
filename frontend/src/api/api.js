import axios from 'axios'
import useAuthStore from '../store/authStore'

const API = axios.create({
  baseURL: 'http://localhost:8080'
})

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const registerUser = (data) => API.post('/auth/register', data, { responseType: 'text' })
export const loginUser    = (data) => API.post('/auth/login',    data, { responseType: 'text' })

// Mood
export const logMood        = (data) => API.post('/mood', data)
export const getMoodHistory = ()     => API.get('/mood/history')
export const deleteMood     = (id)   => API.delete(`/mood/${id}`)

// Journal
export const createJournal = (data) => API.post('/journal/journal', data)
export const getJournals   = ()     => API.get('/journal/journal/history')
export const deleteJournal = (id)   => API.delete(`/journal/${id}`)

// Doctor journal + mood
export const getDoctorPatientMoods    = (id) => API.get(`/mood/doctor/${id}/history`)
export const getDoctorPatientJournals = (id) => API.get(`/journal/doctor/${id}/history`)

// Chat
export const sendMessage   = (data) => API.post('/chatbot', { message: data.message })
export const getChatHistory = ()    => API.get('/chatbot/history')

// Wellness
export const getWellnessReport = () => API.get('/wellness/report')

// Consent
export const inviteDoctor  = (doctorEmail) => API.post('/consent/invite', { doctorEmail })
export const revokeConsent = (id)          => API.post(`/consent/${id}/revoke`)
export const getMyDoctors  = ()            => API.get('/consent/patient/my-doctors')
export const getMyPatients = ()            => API.get('/consent/doctor/my-patients')

export default API 
// Mood Prediction
export const getMoodPrediction = () => API.get('/mood/prediction')