/** 虚构示例明星与商品 — 仅供市场验证 Mock，非真实代言 */

export const celebrities = [
  {
    id: 'c-lin',
    name: '林晓月',
    tagline: '国民甜妹 · 美妆代言',
    fans: '1280万',
    tags: ['美妆', '护肤', '种草'],
    bio: '以清透妆容与日常护肤分享走红。本页为 Mock 货架，点击商品可生成占位推广链。',
    accent: '#5b8def',
  },
  {
    id: 'c-zhou',
    name: '周予安',
    tagline: '运动男孩 · 户外装备',
    fans: '860万',
    tags: ['运动', '户外', '数码'],
    bio: '专注跑步与轻户外装备测评。商品与转链均为演示数据。',
    accent: '#2f9e7f',
  },
  {
    id: 'c-su',
    name: '苏晚晴',
    tagline: '家居达人 · 品质生活',
    fans: '620万',
    tags: ['家居', '母婴', '日用'],
    bio: '分享实用家居好物与省钱清单。未接真实联盟 Key。',
    accent: '#c4785a',
  },
]

const goodsByCelebrity = {
  'c-lin': [
    {
      id: 'g-lin-1',
      title: '清透持妆粉底液 30ml',
      platform: '淘宝',
      price: 129,
      coupon: 20,
      commission: '8.5%',
      itemId: 'mock-tb-10001',
    },
    {
      id: 'g-lin-2',
      title: '氨基酸温和洁面乳 120g',
      platform: '淘宝',
      price: 59,
      coupon: 10,
      commission: '12%',
      itemId: 'mock-tb-10002',
    },
    {
      id: 'g-lin-3',
      title: '修护精华油 小样套装',
      platform: '京东',
      price: 89,
      coupon: 15,
      commission: '6%',
      itemId: 'mock-jd-20001',
    },
  ],
  'c-zhou': [
    {
      id: 'g-zhou-1',
      title: '轻量跑步鞋 透气款',
      platform: '淘宝',
      price: 299,
      coupon: 40,
      commission: '5%',
      itemId: 'mock-tb-11001',
    },
    {
      id: 'g-zhou-2',
      title: '运动速干短袖 2件装',
      platform: '拼多多',
      price: 79,
      coupon: 5,
      commission: '9%',
      itemId: 'mock-pdd-31001',
    },
  ],
  'c-su': [
    {
      id: 'g-su-1',
      title: '收纳盒套装 透明可视',
      platform: '淘宝',
      price: 49,
      coupon: 8,
      commission: '15%',
      itemId: 'mock-tb-12001',
    },
    {
      id: 'g-su-2',
      title: '婴儿湿巾 80抽×6包',
      platform: '京东',
      price: 39.9,
      coupon: 5,
      commission: '7%',
      itemId: 'mock-jd-22001',
    },
  ],
}

export function getCelebrity(id) {
  return celebrities.find((c) => c.id === id) || null
}

export function getGoods(celebrityId) {
  return goodsByCelebrity[celebrityId] || []
}

/** Mock 转链：无联盟 Key 时返回占位短链与口令 */
export function mockGenerateLink(goods, celebrity) {
  const shortUrl = `https://s.click.mock/c/${goods.itemId}`
  const password = `￥MOCK${goods.itemId.slice(-4).toUpperCase()}￥`
  return {
    shortUrl,
    password,
    longUrl: `https://detail.mock.example/item/${goods.itemId}?pid=mock&celebrity=${celebrity.id}`,
    tip: '当前为 Mock 转链，配置联盟 Key 后可替换为真实推广链接。',
  }
}
