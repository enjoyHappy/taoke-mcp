<script setup>
import { celebrities, getGoods } from '../data/mock'

function goodsCount(id) {
  return getGoods(id).length
}
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand-mark" aria-hidden="true">代</div>
      <div class="brand-title">明星代言</div>
      <span class="badge">taoke-mcp MVP · Mock</span>
    </header>

    <section class="hero-card">
      <h1>明星代言</h1>
      <p>
        聚合明星货架与淘客转链。当前为 Mock 演示：点进详情可看代言商品并生成占位推广链。
      </p>
    </section>

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
            粉丝 {{ c.fans }} · {{ goodsCount(c.id) }}件代言商品
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
