<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCelebrity, getGoods, mockGenerateLink } from '../data/mock'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const celebrity = computed(() => getCelebrity(props.id))
const goods = computed(() => (celebrity.value ? getGoods(celebrity.value.id) : []))

const sheetOpen = ref(false)
const linkResult = ref(null)
const copyHint = ref('')

function openLink(item) {
  if (!celebrity.value) return
  linkResult.value = {
    goods: item,
    ...mockGenerateLink(item, celebrity.value),
  }
  copyHint.value = ''
  sheetOpen.value = true
}

function closeSheet() {
  sheetOpen.value = false
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    copyHint.value = '已复制到剪贴板'
  } catch {
    copyHint.value = '复制失败，请手动长按选择'
  }
}
</script>

<template>
  <div class="shell">
    <div class="back-row">
      <button type="button" class="back-btn" @click="router.push({ name: 'list' })">
        ← 返回列表
      </button>
      <span class="badge">Mock 转链</span>
    </div>

    <template v-if="celebrity">
      <section class="profile">
        <div class="profile-top">
          <div class="avatar">待照片</div>
          <div class="celeb-meta">
            <h1>{{ celebrity.name }}</h1>
            <p class="tagline">{{ celebrity.tagline }}</p>
            <div class="tags">
              <span v-for="t in celebrity.tags" :key="t" class="tag">{{ t }}</span>
            </div>
            <div class="stats">粉丝 {{ celebrity.fans }}</div>
          </div>
        </div>
        <p class="bio">{{ celebrity.bio }}</p>
      </section>

      <p class="section-label">代言商品 · {{ goods.length }}</p>

      <div class="goods-list">
        <article v-for="g in goods" :key="g.id" class="goods-card">
          <h3>{{ g.title }}</h3>
          <div class="goods-row">
            <span class="price"><small>¥</small>{{ g.price }}</span>
            <span>券减 ¥{{ g.coupon }}</span>
            <span>{{ g.platform }}</span>
            <span>佣金 {{ g.commission }}</span>
          </div>
          <button type="button" class="btn-primary" @click="openLink(g)">
            去购买 / 转链
          </button>
        </article>
      </div>
    </template>

    <div v-else class="empty">
      <p>未找到该明星</p>
      <button type="button" class="back-btn" @click="router.push({ name: 'list' })">
        回首页
      </button>
    </div>

    <div v-if="sheetOpen && linkResult" class="sheet-mask" @click.self="closeSheet">
      <div class="sheet" role="dialog" aria-modal="true">
        <h3>推广链接（Mock）</h3>
        <p class="tip">{{ linkResult.tip }}</p>
        <div class="field">
          <label>短链</label>
          <code>{{ linkResult.shortUrl }}</code>
        </div>
        <div class="field">
          <label>淘口令（占位）</label>
          <code>{{ linkResult.password }}</code>
        </div>
        <p v-if="copyHint" class="tip">{{ copyHint }}</p>
        <div class="sheet-actions">
          <button type="button" class="btn-ghost" @click="closeSheet">关闭</button>
          <button
            type="button"
            class="btn-primary btn-copy"
            @click="copyText(linkResult.shortUrl)"
          >
            复制短链
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
