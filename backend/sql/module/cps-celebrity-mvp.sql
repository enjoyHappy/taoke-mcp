-- 明星代言 MVP 预留表（可选）
-- 未接 Java 实体 / Controller；可整段 DROP 回滚。
-- 注意：若上游 .gitignore 忽略 backend/sql/module/，提交时请：
--   git add -f backend/sql/module/cps-celebrity-mvp.sql

CREATE TABLE IF NOT EXISTS cps_celebrity (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  celebrity_key VARCHAR(64)  NOT NULL COMMENT '业务键，如 c-lin',
  name          VARCHAR(64)  NOT NULL COMMENT '展示名',
  tagline       VARCHAR(128) NULL COMMENT '一句话介绍',
  fans_text     VARCHAR(32)  NULL COMMENT '粉丝数展示文案',
  tags_json     VARCHAR(512) NULL COMMENT '标签 JSON 数组',
  bio           VARCHAR(512) NULL COMMENT '简介',
  avatar_url    VARCHAR(512) NULL COMMENT '头像 URL',
  status        TINYINT      NOT NULL DEFAULT 1 COMMENT '1上架 0下架',
  sort_order    INT          NOT NULL DEFAULT 0 COMMENT '排序，越小越前',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_celebrity_key (celebrity_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='明星档案（MVP）';

CREATE TABLE IF NOT EXISTS cps_celebrity_goods (
  id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
  celebrity_id  BIGINT       NOT NULL COMMENT 'cps_celebrity.id',
  goods_title   VARCHAR(256) NOT NULL COMMENT '商品标题',
  platform      VARCHAR(32)  NOT NULL COMMENT '平台：淘宝/京东/拼多多等',
  item_id       VARCHAR(128) NOT NULL COMMENT '联盟商品 ID / 占位 ID',
  price         DECIMAL(10,2) NULL COMMENT '展示价',
  coupon_amount DECIMAL(10,2) NULL COMMENT '券面额',
  commission    VARCHAR(32)  NULL COMMENT '佣金展示',
  selection_theme_id BIGINT   NULL COMMENT '可选：映射选品库主题',
  status        TINYINT      NOT NULL DEFAULT 1 COMMENT '1上架 0下架',
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_celebrity_id (celebrity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='明星代言商品（MVP）';

-- 回滚示例：
-- DROP TABLE IF EXISTS cps_celebrity_goods;
-- DROP TABLE IF EXISTS cps_celebrity;
