# 明星代言 · 轻量管理 API

JSON 文件存储（`data/store.json`，首次从 `seed.json` 复制）。  
无 MySQL / Redis；契约与后续 AgenticCPS admin 路径对齐，便于迁移。

## 启动

```bash
cd backend/celebrity-admin
npm install
npm run dev
# http://127.0.0.1:8787/api/health
```

## 主要接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET/PUT | `/api/platforms` `/api/platforms/:id` | 平台 Key |
| CRUD | `/api/goods` | 商品与佣金率 |
| CRUD | `/api/celebrities` | 明星 |
| PUT | `/api/celebrities/:id/goods` | 绑定代言商品 |
| GET | `/api/client/celebrities` | 客户端列表 |
| GET | `/api/client/celebrities/:id` | 客户端详情（含商品） |
| POST | `/api/client/link` | Mock/占位转链 |

响应形如 `{ code: 0, data, msg }`。
