# 明星代言 H5 Demo（Mock）

独立 Vue3 + Vite 演示：明星列表 → 详情 → 代言商品 → Mock 转链。  
不依赖联盟 Key / MySQL / Redis。

## 运行

```bash
cd frontend/celebrity-mvp
npm install
npm run dev
# http://127.0.0.1:5177/
```

## 说明

- 数据：`src/data/mock.js`（虚构明星与商品）
- 后续接真实转链：替换 `mockGenerateLink` 为淘客 MCP / 联盟 API
