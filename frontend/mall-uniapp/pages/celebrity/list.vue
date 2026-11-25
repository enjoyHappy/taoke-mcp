<template>
  <view class="page">
    <view class="hero">
      <text class="hero-title">明星代言</text>
      <text class="hero-desc">Mock 切片：点进详情看代言商品。完整 H5 见 frontend/celebrity-mvp。</text>
    </view>
    <view
      v-for="c in celebrities"
      :key="c.id"
      class="card"
      @click="goDetail(c.id)"
    >
      <view class="avatar">待照片</view>
      <view class="meta">
        <text class="name">{{ c.name }}</text>
        <text class="tagline">{{ c.tagline }}</text>
        <text class="stats">粉丝 {{ c.fans }} · {{ c.goodsCount }}件代言商品</text>
      </view>
    </view>
  </view>
</template>

<script>
const MOCK = [
  { id: 'c-lin', name: '林晓月', tagline: '国民甜妹 · 美妆代言', fans: '1280万', goodsCount: 3 },
  { id: 'c-zhou', name: '周予安', tagline: '运动男孩 · 户外装备', fans: '860万', goodsCount: 2 },
  { id: 'c-su', name: '苏晚晴', tagline: '家居达人 · 品质生活', fans: '620万', goodsCount: 2 },
]

export default {
  data() {
    return { celebrities: MOCK }
  },
  methods: {
    goDetail(id) {
      uni.navigateTo({ url: `/pages/celebrity/detail?id=${id}` })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 28rpx 48rpx;
  background: linear-gradient(180deg, #c9dff8, #f7fafc);
}
.hero {
  background: linear-gradient(135deg, #2a6fdb, #4a8ff0);
  border-radius: 24rpx;
  padding: 32rpx;
  color: #fff;
  margin-bottom: 24rpx;
}
.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 12rpx;
}
.hero-desc {
  font-size: 24rpx;
  opacity: 0.92;
  line-height: 1.5;
}
.card {
  display: flex;
  gap: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 20rpx;
  background: #e8eef6;
  color: #8a9aab;
  font-size: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.name {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a2332;
}
.tagline,
.stats {
  font-size: 24rpx;
  color: #5c6b7a;
}
</style>
