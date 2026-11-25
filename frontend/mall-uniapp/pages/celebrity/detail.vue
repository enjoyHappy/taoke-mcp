<template>
  <view class="page">
    <view v-if="celebrity" class="profile">
      <text class="name">{{ celebrity.name }}</text>
      <text class="tagline">{{ celebrity.tagline }}</text>
      <text class="bio">{{ celebrity.bio }}</text>
    </view>
    <view v-else class="empty">未找到明星</view>

    <view v-for="g in goods" :key="g.id" class="goods">
      <text class="title">{{ g.title }}</text>
      <text class="price">¥{{ g.price }} · {{ g.platform }}</text>
      <button class="btn" type="primary" @click="onLink(g)">去购买 / 转链</button>
    </view>

    <view v-if="linkTip" class="toast">{{ linkTip }}</view>
  </view>
</template>

<script>
const CELEBS = {
  'c-lin': {
    name: '林晓月',
    tagline: '国民甜妹 · 美妆代言',
    bio: 'Mock 货架；优先尝试真实 generateLink，失败回落 Mock。',
  },
  'c-zhou': {
    name: '周予安',
    tagline: '运动男孩 · 户外装备',
    bio: 'Mock 货架演示。',
  },
  'c-su': {
    name: '苏晚晴',
    tagline: '家居达人 · 品质生活',
    bio: 'Mock 货架演示。',
  },
}

const GOODS = {
  'c-lin': [
    { id: 'g1', title: '清透持妆粉底液 30ml', price: 129, platform: '淘宝', itemId: 'mock-tb-10001' },
    { id: 'g2', title: '氨基酸温和洁面乳 120g', price: 59, platform: '淘宝', itemId: 'mock-tb-10002' },
    { id: 'g3', title: '修护精华油 小样套装', price: 89, platform: '京东', itemId: 'mock-jd-20001' },
  ],
  'c-zhou': [
    { id: 'g1', title: '轻量跑步鞋 透气款', price: 299, platform: '淘宝', itemId: 'mock-tb-11001' },
    { id: 'g2', title: '运动速干短袖 2件装', price: 79, platform: '拼多多', itemId: 'mock-pdd-31001' },
  ],
  'c-su': [
    { id: 'g1', title: '收纳盒套装 透明可视', price: 49, platform: '淘宝', itemId: 'mock-tb-12001' },
    { id: 'g2', title: '婴儿湿巾 80抽×6包', price: 39.9, platform: '京东', itemId: 'mock-jd-22001' },
  ],
}

export default {
  data() {
    return {
      id: '',
      celebrity: null,
      goods: [],
      linkTip: '',
    }
  },
  onLoad(query) {
    this.id = (query && query.id) || 'c-lin'
    this.celebrity = CELEBS[this.id] || null
    this.goods = GOODS[this.id] || []
  },
  methods: {
    async onLink(g) {
      // 若宿主项目存在 CpsGoodsApi.generateLink 可在此调用；本 fork 默认 Mock
      let usedMock = true
      try {
        // eslint-disable-next-line no-undef
        if (typeof CpsGoodsApi !== 'undefined' && CpsGoodsApi.generateLink) {
          await CpsGoodsApi.generateLink({ itemId: g.itemId })
          usedMock = false
          this.linkTip = '已调用真实转链'
        }
      } catch (e) {
        usedMock = true
      }
      if (usedMock) {
        const url = `https://s.click.mock/c/${g.itemId}`
        this.linkTip = `Mock 短链：${url}`
        // #ifdef H5
        try {
          await navigator.clipboard.writeText(url)
          this.linkTip += '（已复制）'
        } catch (_) {}
        // #endif
      }
      setTimeout(() => {
        this.linkTip = ''
      }, 3200)
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 24rpx 28rpx 80rpx;
  background: #f7fafc;
}
.profile {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}
.name {
  font-size: 40rpx;
  font-weight: 700;
  display: block;
}
.tagline,
.bio {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #5c6b7a;
  line-height: 1.5;
}
.goods {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.title {
  font-size: 30rpx;
  font-weight: 600;
  display: block;
}
.price {
  display: block;
  margin: 12rpx 0 20rpx;
  color: #d4380d;
  font-size: 28rpx;
}
.btn {
  background: #2a6fdb;
  color: #fff;
  border-radius: 16rpx;
  font-size: 28rpx;
}
.empty {
  text-align: center;
  color: #888;
  padding: 80rpx;
}
.toast {
  position: fixed;
  left: 40rpx;
  right: 40rpx;
  bottom: 60rpx;
  background: rgba(26, 35, 50, 0.88);
  color: #fff;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  word-break: break-all;
}
</style>
