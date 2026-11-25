<script setup>
import { onMounted, ref } from 'vue'
import { api } from './api/client'

const health = ref(null)
const err = ref('')

onMounted(async () => {
  try {
    health.value = await api.health()
  } catch (e) {
    err.value = e.message || 'API 未启动'
  }
})
</script>

<template>
  <div class="layout">
    <aside class="side">
      <div class="brand">
        <div class="mark">代</div>
        <div>
          <strong>明星代言</strong>
          <span>管理端 MVP</span>
        </div>
      </div>
      <nav class="nav">
        <router-link to="/platforms">平台 Key</router-link>
        <router-link to="/goods">商品 / 佣金</router-link>
        <router-link to="/celebrities">明星与绑定</router-link>
      </nav>
      <p class="hint" style="margin-top: auto; color: #9aa8b8; padding: 10px">
        <template v-if="health">
          API 正常 · 明星 {{ health.celebrities }} · 商品 {{ health.goods }}
        </template>
        <template v-else>API：{{ err || '检测中…' }}</template>
      </p>
    </aside>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>
