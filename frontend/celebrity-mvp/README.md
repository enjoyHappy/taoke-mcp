# 明星代言 H5 Demo

Vue3 + Vite：明星列表 → 详情 → 代言商品 → 转链。  
优先读取管理端 API（`/api/client/*`），API 不可用时回落 `src/data/mock.js`。

## 运行

```bash
# terminal 1 — 管理 API
cd backend/celebrity-admin && npm install && npm run dev

# terminal 2 — 客户端
cd frontend/celebrity-mvp && npm install && npm run dev
# http://127.0.0.1:5177/
```

管理端 UI：`frontend/celebrity-admin` → http://127.0.0.1:5178/

## 说明

- 管理端改绑定后，刷新客户端即可看到新货架
- 真实联盟 Key 需在管理端配置；转链在未接 MCP 前仍为占位 URL
