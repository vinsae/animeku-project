import axios from 'axios'

const api = axios.create({
  baseURL: '/api/otakudesu',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const getOngoing  = (page = 1) => api.get(`/ongoing`,   { params: { page } })
export const getComplete = (page = 1) => api.get(`/completed`, { params: { page } })
export const getDetail   = (id)       => api.get(`/anime/${id}`)
export const getWatch    = (epId)     => api.get(`/episode/${epId}`)
export const getServer   = (srvId)    => api.get(`/server/${srvId}`)
export const searchAnime = (query)    => api.get(`/search`, { params: { q: query } })

export default api
