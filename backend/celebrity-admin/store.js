import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const SEED_PATH = path.join(DATA_DIR, 'seed.json')
const STORE_PATH = path.join(DATA_DIR, 'store.json')

function clone(v) {
  return JSON.parse(JSON.stringify(v))
}

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(STORE_PATH)
  } catch {
    const seed = JSON.parse(await fs.readFile(SEED_PATH, 'utf8'))
    await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), 'utf8')
  }
}

export async function readStore() {
  await ensureStore()
  return JSON.parse(await fs.readFile(STORE_PATH, 'utf8'))
}

export async function writeStore(data) {
  await ensureStore()
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export async function resetStore() {
  const seed = JSON.parse(await fs.readFile(SEED_PATH, 'utf8'))
  await writeStore(seed)
  return clone(seed)
}

export function maskPlatform(p) {
  const secret = p.appSecret || ''
  return {
    ...p,
    appSecret: secret ? `${secret.slice(0, 2)}****${secret.slice(-2)}` : '',
    hasSecret: Boolean(secret),
  }
}

export function formatGoods(g) {
  return {
    ...g,
    commission: `${Number(g.commissionRate)}%`,
  }
}

export function celebrityWithGoods(c, goods) {
  const map = new Map(goods.map((g) => [g.id, g]))
  const bound = (c.goodsIds || [])
    .map((id) => map.get(id))
    .filter(Boolean)
    .filter((g) => g.status !== 0)
    .map(formatGoods)
  return {
    ...c,
    goods: bound,
    goodsCount: bound.length,
  }
}

export function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
