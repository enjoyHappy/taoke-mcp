<script setup>
import { onMounted, ref } from 'vue'
import { fetchCelebrityList } from '../api/client'

const celebrities = ref([])
const source = ref('…')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetchCelebrityList()
    celebrities.value = res.list
    source.value = res.source === 'api' ? '管理端数据' : '本地 Seed（API 未启动）'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand-mark" aria-hidden="true">代</div>
      <div class="brand-title">明星代言</div>
      <span class="badge">{{ source }}</span>
    </header>

    <section class="hero-card">
      <h1>明星代言</h1>
      <p>
        聚合明星货架与淘客转链。列表由管理端配置驱动；未启 API 时回落本地 Seed。
      </p>
    </section>

    <p v-if="loading" class="section-label">加载中…</p>
    <p v-else-if="error" class="section-label">{{ error }}</p>
    <template v-else>
      <p class="section-label">热门明星 · {{ celebrities.length }} 位</p>

      <div class="card-list">
        <router-link
          v-for="c in celebrities"
          :key="c.id"
          class="celeb-card"
          :to="{ name: 'detail', params: { id: c.id } }"
        >
          <div class="avatar">待照片</div>
          <div class="celeb-meta">
            <h2>{{ c.name }}</h2>
            <p class="tagline">{{ c.tagline }}</p>
            <div class="tags">
              <span v-for="t in c.tags" :key="t" class="tag">{{ t }}</span>
            </div>
            <div class="stats">
              粉丝 {{ c.fans }} · {{ c.goodsCount }}件代言商品
            </div>
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>
