import {
  celebrities as seedCelebrities,
  getCelebrity as seedGetCelebrity,
  getGoods as seedGetGoods,
  mockGenerateLink,
} from '../data/mock'

async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.code !== 0) {
    throw new Error(json.msg || `HTTP ${res.status}`)
  }
  return json.data
}

export async function fetchCelebrityList() {
  try {
    const list = await request('/api/client/celebrities')
    return { source: 'api', list }
  } catch {
    return {
      source: 'seed',
      list: seedCelebrities.map((c) => ({
        ...c,
        goodsCount: seedGetGoods(c.id).length,
      })),
    }
  }
}

export async function fetchCelebrityDetail(id) {
  try {
    const detail = await request(`/api/client/celebrities/${id}`)
    return { source: 'api', detail }
  } catch {
    const c = seedGetCelebrity(id)
    if (!c) return { source: 'seed', detail: null }
    return {
      source: 'seed',
      detail: { ...c, goods: seedGetGoods(id), goodsCount: seedGetGoods(id).length },
    }
  }
}

export async function requestLink(goodsId, celebrityId, fallbackGoods, fallbackCelebrity) {
  try {
    const data = await request('/api/client/link', {
      method: 'POST',
      body: JSON.stringify({ goodsId, celebrityId }),
    })
    return { source: 'api', ...data }
  } catch {
    return {
      source: 'seed',
      ...mockGenerateLink(fallbackGoods, fallbackCelebrity),
      mock: true,
    }
  }
}
