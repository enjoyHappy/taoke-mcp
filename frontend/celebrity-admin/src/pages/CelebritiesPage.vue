<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '../api/client'

const celebs = ref([])
const goods = ref([])
const toast = ref('')
const editingId = ref('')
const form = reactive({
  name: '',
  tagline: '',
  fans: '',
  tags: '',
  bio: '',
})

const editing = computed(() => celebs.value.find((c) => c.id === editingId.value) || null)

async function load() {
  ;[celebs.value, goods.value] = await Promise.all([api.celebrities(), api.goods()])
}

function show(msg) {
  toast.value = msg
  setTimeout(() => {
    toast.value = ''
  }, 2200)
}

async function create() {
  try {
    await api.createCelebrity({
      name: form.name,
      tagline: form.tagline,
      fans: form.fans,
      tags: form.tags,
      bio: form.bio,
      goodsIds: [],
    })
    Object.assign(form, { name: '', tagline: '', fans: '', tags: '', bio: '' })
    await load()
    show('明星已创建')
  } catch (e) {
    show(e.message)
  }
}

function startEdit(c) {
  editingId.value = c.id
}

function isBound(goodsId) {
  return (editing.value?.goodsIds || []).includes(goodsId)
}

async function toggleGoods(goodsId) {
  if (!editing.value) return
  const set = new Set(editing.value.goodsIds || [])
  if (set.has(goodsId)) set.delete(goodsId)
  else set.add(goodsId)
  try {
    await api.bindGoods(editing.value.id, [...set])
    await load()
    show('绑定已更新；客户端刷新后可见')
  } catch (e) {
    show(e.message)
  }
}

async function saveMeta(c) {
  try {
    await api.updateCelebrity(c.id, {
      name: c.name,
      tagline: c.tagline,
      fans: c.fans,
      tags: c.tags,
      bio: c.bio,
      status: c.status,
    })
    await load()
    show('已保存')
  } catch (e) {
    show(e.message)
  }
}

async function remove(c) {
  if (!confirm(`删除明星「${c.name}」？`)) return
  await api.deleteCelebrity(c.id)
  if (editingId.value === c.id) editingId.value = ''
  await load()
  show('已删除')
}

onMounted(load)
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <h1>明星与代言商品</h1>
        <p>维护明星档案，并把商品库中的 SKU 绑定到明星货架。客户端读取同一套数据。</p>
      </div>
    </div>

    <div class="card">
      <h2>新增明星</h2>
      <div class="grid-2">
        <div class="field"><label>姓名</label><input v-model="form.name" /></div>
        <div class="field"><label>标语</label><input v-model="form.tagline" /></div>
        <div class="field"><label>粉丝</label><input v-model="form.fans" placeholder="如 1280万" /></div>
        <div class="field"><label>标签（逗号分隔）</label><input v-model="form.tags" /></div>
      </div>
      <div class="field"><label>简介</label><textarea v-model="form.bio" /></div>
      <button class="btn btn-primary" @click="create">创建</button>
    </div>

    <div class="card">
      <h2>明星列表 · {{ celebs.length }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>标语</th>
            <th>粉丝</th>
            <th>商品数</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in celebs" :key="c.id">
            <td><input v-model="c.name" style="width: 100px" /></td>
            <td><input v-model="c.tagline" style="width: 160px" /></td>
            <td><input v-model="c.fans" style="width: 80px" /></td>
            <td>{{ c.goodsCount }}</td>
            <td>
              <select v-model.number="c.status">
                <option :value="1">上架</option>
                <option :value="0">下架</option>
              </select>
            </td>
            <td style="white-space: nowrap">
              <button class="btn" @click="saveMeta(c)">保存</button>
              <button class="btn btn-primary" @click="startEdit(c)">绑定商品</button>
              <button class="btn btn-danger" @click="remove(c)">删</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editing" class="card">
      <h2>为「{{ editing.name }}」绑定代言商品</h2>
      <p class="hint">点击切换选中；已选 {{ (editing.goodsIds || []).length }} 件</p>
      <div class="chips" style="margin-top: 12px">
        <button
          v-for="g in goods"
          :key="g.id"
          type="button"
          class="chip"
          :class="{ on: isBound(g.id) }"
          @click="toggleGoods(g.id)"
        >
          {{ g.title }} · {{ g.commission }} · ¥{{ g.price }}
        </button>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
