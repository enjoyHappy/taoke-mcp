<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../api/client'

const list = ref([])
const toast = ref('')
const saving = ref('')

async function load() {
  list.value = await api.platforms()
}

function show(msg) {
  toast.value = msg
  setTimeout(() => {
    toast.value = ''
  }, 2200)
}

async function save(p) {
  saving.value = p.id
  try {
    await api.savePlatform(p.id, {
      appKey: p.appKey,
      appSecret: p._secretDraft || '',
      pid: p.pid,
      enabled: p.enabled,
      note: p.note,
    })
    p._secretDraft = ''
    await load()
    show(`已保存 ${p.name}`)
  } catch (e) {
    show(e.message)
  } finally {
    saving.value = ''
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="page-head">
      <div>
        <h1>平台 API Key</h1>
        <p>配置淘宝联盟 / 大淘客等。密钥仅存本地 JSON，不会回显明文；留空不覆盖。</p>
      </div>
    </div>

    <div v-for="p in list" :key="p.id" class="card">
      <div style="display: flex; justify-content: space-between; gap: 12px; align-items: center">
        <h2 style="margin: 0">{{ p.name }}</h2>
        <span class="badge" :class="p.enabled ? 'on' : 'off'">
          {{ p.enabled ? '已启用' : '未启用' }}
        </span>
      </div>
      <p class="hint">{{ p.note }}</p>
      <div class="grid-2" style="margin-top: 12px">
        <div class="field">
          <label>App Key</label>
          <input v-model="p.appKey" placeholder="填写后保存" />
        </div>
        <div class="field">
          <label>App Secret{{ p.hasSecret ? '（已配置，输入新值可覆盖）' : '' }}</label>
          <input
            v-model="p._secretDraft"
            type="password"
            :placeholder="p.hasSecret ? '••••••••' : '未配置'"
            autocomplete="new-password"
          />
        </div>
        <div class="field">
          <label>PID / 推广位</label>
          <input v-model="p.pid" placeholder="可选" />
        </div>
        <div class="field">
          <label>启用</label>
          <select v-model="p.enabled">
            <option :value="true">启用</option>
            <option :value="false">关闭</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" :disabled="saving === p.id" @click="save(p)">
        {{ saving === p.id ? '保存中…' : '保存' }}
      </button>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>
