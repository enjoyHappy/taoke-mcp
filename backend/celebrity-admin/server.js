import express from 'express'
import cors from 'cors'
import {
  readStore,
  writeStore,
  resetStore,
  maskPlatform,
  formatGoods,
  celebrityWithGoods,
  uid,
} from './store.js'

const PORT = Number(process.env.PORT || 8787)
const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function ok(data) {
  return { code: 0, data, msg: 'ok' }
}

function fail(msg, code = 1) {
  return { code, data: null, msg }
}

app.get('/api/health', async (_req, res) => {
  const store = await readStore()
  res.json(
    ok({
      service: 'celebrity-admin',
      celebrities: store.celebrities.length,
      goods: store.goods.length,
      platforms: store.platforms.length,
    }),
  )
})

/** —— 平台 Key 配置 —— */
app.get('/api/platforms', async (_req, res) => {
  const store = await readStore()
  res.json(ok(store.platforms.map(maskPlatform)))
})

app.put('/api/platforms/:id', async (req, res) => {
  const store = await readStore()
  const idx = store.platforms.findIndex((p) => p.id === req.params.id)
  if (idx < 0) return res.status(404).json(fail('platform not found'))
  const cur = store.platforms[idx]
  const body = req.body || {}
  const next = {
    ...cur,
    name: body.name ?? cur.name,
    appKey: body.appKey ?? cur.appKey,
    pid: body.pid ?? cur.pid,
    enabled: body.enabled ?? cur.enabled,
    note: body.note ?? cur.note,
  }
  // 空字符串或带 **** 的掩码不覆盖原 secret
  if (typeof body.appSecret === 'string' && body.appSecret && !body.appSecret.includes('****')) {
    next.appSecret = body.appSecret
  }
  store.platforms[idx] = next
  await writeStore(store)
  res.json(ok(maskPlatform(next)))
})

/** —— 商品 / 佣金 —— */
app.get('/api/goods', async (_req, res) => {
  const store = await readStore()
  res.json(ok(store.goods.map(formatGoods)))
})

app.post('/api/goods', async (req, res) => {
  const store = await readStore()
  const b = req.body || {}
  if (!b.title || !b.itemId) return res.status(400).json(fail('title and itemId required'))
  const item = {
    id: b.id || uid('g'),
    title: b.title,
    platform: b.platform || '淘宝',
    platformId: b.platformId || 'taobao',
    price: Number(b.price) || 0,
    coupon: Number(b.coupon) || 0,
    commissionRate: Number(b.commissionRate) || 0,
    itemId: String(b.itemId),
    status: b.status === 0 ? 0 : 1,
  }
  store.goods.push(item)
  await writeStore(store)
  res.json(ok(formatGoods(item)))
})

app.put('/api/goods/:id', async (req, res) => {
  const store = await readStore()
  const idx = store.goods.findIndex((g) => g.id === req.params.id)
  if (idx < 0) return res.status(404).json(fail('goods not found'))
  const cur = store.goods[idx]
  const b = req.body || {}
  const next = {
    ...cur,
    title: b.title ?? cur.title,
    platform: b.platform ?? cur.platform,
    platformId: b.platformId ?? cur.platformId,
    price: b.price !== undefined ? Number(b.price) : cur.price,
    coupon: b.coupon !== undefined ? Number(b.coupon) : cur.coupon,
    commissionRate:
      b.commissionRate !== undefined ? Number(b.commissionRate) : cur.commissionRate,
    itemId: b.itemId ?? cur.itemId,
    status: b.status !== undefined ? Number(b.status) : cur.status,
  }
  store.goods[idx] = next
  await writeStore(store)
  res.json(ok(formatGoods(next)))
})

app.delete('/api/goods/:id', async (req, res) => {
  const store = await readStore()
  const id = req.params.id
  store.goods = store.goods.filter((g) => g.id !== id)
  store.celebrities = store.celebrities.map((c) => ({
    ...c,
    goodsIds: (c.goodsIds || []).filter((gid) => gid !== id),
  }))
  await writeStore(store)
  res.json(ok(true))
})

/** —— 明星 —— */
app.get('/api/celebrities', async (_req, res) => {
  const store = await readStore()
  res.json(ok(store.celebrities.map((c) => celebrityWithGoods(c, store.goods))))
})

app.get('/api/celebrities/:id', async (req, res) => {
  const store = await readStore()
  const c = store.celebrities.find((x) => x.id === req.params.id)
  if (!c) return res.status(404).json(fail('celebrity not found'))
  res.json(ok(celebrityWithGoods(c, store.goods)))
})

app.post('/api/celebrities', async (req, res) => {
  const store = await readStore()
  const b = req.body || {}
  if (!b.name) return res.status(400).json(fail('name required'))
  const item = {
    id: b.id || uid('c'),
    name: b.name,
    tagline: b.tagline || '',
    fans: b.fans || '0',
    tags: Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(/[,，\s]+/).filter(Boolean),
    bio: b.bio || '',
    accent: b.accent || '#2a6fdb',
    status: b.status === 0 ? 0 : 1,
    goodsIds: Array.isArray(b.goodsIds) ? b.goodsIds : [],
  }
  store.celebrities.push(item)
  await writeStore(store)
  res.json(ok(celebrityWithGoods(item, store.goods)))
})

app.put('/api/celebrities/:id', async (req, res) => {
  const store = await readStore()
  const idx = store.celebrities.findIndex((c) => c.id === req.params.id)
  if (idx < 0) return res.status(404).json(fail('celebrity not found'))
  const cur = store.celebrities[idx]
  const b = req.body || {}
  const next = {
    ...cur,
    name: b.name ?? cur.name,
    tagline: b.tagline ?? cur.tagline,
    fans: b.fans ?? cur.fans,
    tags:
      b.tags !== undefined
        ? Array.isArray(b.tags)
          ? b.tags
          : String(b.tags).split(/[,，\s]+/).filter(Boolean)
        : cur.tags,
    bio: b.bio ?? cur.bio,
    accent: b.accent ?? cur.accent,
    status: b.status !== undefined ? Number(b.status) : cur.status,
    goodsIds: b.goodsIds !== undefined ? b.goodsIds : cur.goodsIds,
  }
  store.celebrities[idx] = next
  await writeStore(store)
  res.json(ok(celebrityWithGoods(next, store.goods)))
})

app.put('/api/celebrities/:id/goods', async (req, res) => {
  const store = await readStore()
  const idx = store.celebrities.findIndex((c) => c.id === req.params.id)
  if (idx < 0) return res.status(404).json(fail('celebrity not found'))
  const goodsIds = Array.isArray(req.body?.goodsIds) ? req.body.goodsIds : []
  const known = new Set(store.goods.map((g) => g.id))
  store.celebrities[idx].goodsIds = goodsIds.filter((id) => known.has(id))
  await writeStore(store)
  res.json(ok(celebrityWithGoods(store.celebrities[idx], store.goods)))
})

app.delete('/api/celebrities/:id', async (req, res) => {
  const store = await readStore()
  store.celebrities = store.celebrities.filter((c) => c.id !== req.params.id)
  await writeStore(store)
  res.json(ok(true))
})

/** —— 客户端只读 —— */
app.get('/api/client/celebrities', async (_req, res) => {
  const store = await readStore()
  const list = store.celebrities
    .filter((c) => c.status !== 0)
    .map((c) => {
      const full = celebrityWithGoods(c, store.goods)
      return {
        id: full.id,
        name: full.name,
        tagline: full.tagline,
        fans: full.fans,
        tags: full.tags,
        bio: full.bio,
        accent: full.accent,
        goodsCount: full.goodsCount,
      }
    })
  res.json(ok(list))
})

app.get('/api/client/celebrities/:id', async (req, res) => {
  const store = await readStore()
  const c = store.celebrities.find((x) => x.id === req.params.id && x.status !== 0)
  if (!c) return res.status(404).json(fail('celebrity not found'))
  res.json(ok(celebrityWithGoods(c, store.goods)))
})

app.post('/api/client/link', async (req, res) => {
  const store = await readStore()
  const { goodsId, celebrityId } = req.body || {}
  const goods = store.goods.find((g) => g.id === goodsId)
  const celebrity = store.celebrities.find((c) => c.id === celebrityId)
  if (!goods) return res.status(404).json(fail('goods not found'))
  const platform = store.platforms.find((p) => p.id === goods.platformId)
  const configured = platform && platform.enabled && platform.appKey && platform.appSecret
  const shortUrl = `https://s.click.mock/c/${goods.itemId}`
  const password = `￥MOCK${String(goods.itemId).slice(-4).toUpperCase()}￥`
  res.json(
    ok({
      shortUrl,
      password,
      longUrl: `https://detail.mock.example/item/${goods.itemId}?celebrity=${celebrityId || ''}`,
      tip: configured
        ? `已检测到 ${platform.name} Key（仍为演示占位链；接真实 MCP/联盟 API 后可替换）。`
        : '当前为 Mock 转链。请在管理端配置并启用对应平台 Key 后再接真实推广链。',
      mock: !configured,
      platformId: goods.platformId,
      celebrityName: celebrity?.name || null,
      commission: formatGoods(goods).commission,
    }),
  )
})

app.post('/api/admin/reset', async (_req, res) => {
  const data = await resetStore()
  res.json(ok({ reset: true, celebrities: data.celebrities.length, goods: data.goods.length }))
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[celebrity-admin] http://127.0.0.1:${PORT}`)
})
