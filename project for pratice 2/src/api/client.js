const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const authToken = token || localStorage.getItem('token')
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const isJSON = res.headers.get('content-type')?.includes('application/json')
  const data = isJSON ? await res.json() : await res.text()
  if (!res.ok) throw new Error(data?.message || data || 'Request failed')
  return data
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  me: () => request('/users/me'),
  updateProfile: (payload) => request('/users/me', { method: 'PUT', body: payload }),
  listTeammates: () => request('/users?role=student'),
  listMentors: () => request('/users?role=mentor'),
  listEvents: () => request('/events'),
  connect: (userId) => request(`/connections/${userId}`, { method: 'POST' }),
  matches: () => request('/matches'),
}

export function saveAuth(token) {
  localStorage.setItem('token', token)
}

export function clearAuth() {
  localStorage.removeItem('token')
}
