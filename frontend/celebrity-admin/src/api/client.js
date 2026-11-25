const BASE = ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.code !== 0) {
    throw new Error(json.msg || `HTTP ${res.status}`)
  }
  return json.data
}

export const api = {
  health: () => request('/api/health'),
  platforms: () => request('/api/platforms'),
  savePlatform: (id, body) =>
    request(`/api/platforms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  goods: () => request('/api/goods'),
  createGoods: (body) => request('/api/goods', { method: 'POST', body: JSON.stringify(body) }),
  updateGoods: (id, body) =>
    request(`/api/goods/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGoods: (id) => request(`/api/goods/${id}`, { method: 'DELETE' }),
  celebrities: () => request('/api/celebrities'),
  createCelebrity: (body) =>
    request('/api/celebrities', { method: 'POST', body: JSON.stringify(body) }),
  updateCelebrity: (id, body) =>
    request(`/api/celebrities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  bindGoods: (id, goodsIds) =>
    request(`/api/celebrities/${id}/goods`, {
      method: 'PUT',
      body: JSON.stringify({ goodsIds }),
    }),
  deleteCelebrity: (id) => request(`/api/celebrities/${id}`, { method: 'DELETE' }),
  reset: () => request('/api/admin/reset', { method: 'POST' }),
}
