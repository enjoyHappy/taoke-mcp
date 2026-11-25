<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from '../api/client'

const list = ref([])
const toast = ref('')
const form = reactive({
  title: '',
  platform: '淘宝',
  platformId: 'taobao',
  price: 99,
  coupon: 0,
  commissionRate: 8,
  itemId: '',
})

async function load() {
  list.value = await api.goods()
}

function show(msg) {
  toast.value = msg
  setTimeout(() => {
    toast.value = ''
  }, 2200)
}

async function create() {
  try {
    await api.createGoods({ ...form })
    Object.assign(form, {
      title: '',
      itemId: '',
      price: 99,
      coupon: 0,
      commissionRate: 8,
    })
    await load()
    show('商品已创建')
  } catch (e) {
    show(e.message)
  }
}

async function saveRow(g) {
  try {
    await api.updateGoods(g.id, {
      title: g.title,
      platform: g.platform,
      platformId: g.platformId,
      price: g.price,
      coupon: g.coupon,
      commissionRate: g.commissionRate,
      itemId: g.itemId,
      status: g.status,
    })
    await load()
    show('已更新')
  } catch (e) {
    show(e.message)
  }
}

async function remove(g) {
  if (!confirm(`删除商品「${g.title}」？`)) return
  await api.deleteGoods(g.id)
  await load()
  show('已删除')
}

onMounted(load)
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <h1>商品与佣金</h1>
        <p>维护代言商品、价格、券额与佣金率。绑定在「明星与绑定」完成。</p>
      </div>
    </div>

    <div class="card">
      <h2>新增商品</h2>
      <div class="grid-2">
        <div class="field">
          <label>标题</label>
          <input v-model="form.title" />
        </div>
        <div class="field">
          <label>联盟商品 ID</label>
          <input v-model="form.itemId" placeholder="itemId" />
        </div>
        <div class="field">
          <label>平台</label>
          <select
            v-model="form.platformId"
            @change="form.platform = { taobao: '淘宝', jd: '京东', pdd: '拼多多', dataoke: '大淘客' }[form.platformId] || form.platformId"
          >
            <option value="taobao">淘宝</option>
            <option value="jd">京东</option>
            <option value="pdd">拼多多</option>
            <option value="dataoke">大淘客</option>
          </select>
        </div>
        <div class="field">
          <label>佣金率 %</label>
          <input v-model.number="form.commissionRate" type="number" step="0.1" />
        </div>
        <div class="field">
          <label>售价</label>
          <input v-model.number="form.price" type="number" step="0.1" />
        </div>
        <div class="field">
          <label>券减</label>
          <input v-model.number="form.coupon" type="number" step="0.1" />
        </div>
      </div>
      <button class="btn btn-primary" @click="create">创建</button>
    </div>

    <div class="card">
      <h2>商品列表 · {{ list.length }}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>标题</th>
            <th>平台</th>
            <th>价 / 券</th>
            <th>佣金%</th>
            <th>itemId</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in list" :key="g.id">
            <td><input v-model="g.title" style="width: 100%" /></td>
            <td>{{ g.platform }}</td>
            <td>
              <input v-model.number="g.price" type="number" style="width: 72px" />
              /
              <input v-model.number="g.coupon" type="number" style="width: 56px" />
            </td>
            <td>
              <input v-model.number="g.commissionRate" type="number" step="0.1" style="width: 64px" />
            </td>
            <td><input v-model="g.itemId" style="width: 120px" /></td>
            <td>
              <select v-model.number="g.status">
                <option :value="1">上架</option>
                <option :value="0">下架</option>
              </select>
            </td>
            <td style="white-space: nowrap">
              <button class="btn" @click="saveRow(g)">保存</button>
              <button class="btn btn-danger" @click="remove(g)">删</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
