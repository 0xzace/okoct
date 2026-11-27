# SEO Audit Rules

规则版本：`0.4.0`

| Rule ID | 分类 | 等级 | 默认阻断 | 检查 |
| --- | --- | --- | --- | --- |
| `META_TITLE_MISSING` | Metadata | Error | 是 | 可索引页缺少 title |
| `META_DESCRIPTION_MISSING` | Metadata | Error | 是 | 可索引页缺少 description |
| `CANONICAL_MISSING` | Canonical | Error | 是 | 可索引页缺少 canonical |
| `CANONICAL_ORIGIN` | Canonical | Error | 是 | canonical 跨站点 |
| `CANONICAL_TARGET` | Canonical | Error | 是 | canonical 目标不在本地爬取集合 |
| `SITEMAP_NON_INDEXABLE` | Sitemap | Error | 是 | sitemap 包含 noindex/不可用页面 |
| `ROBOTS_BLOCK_ALL` | Robots | Error | 是 | robots.txt 阻断整个站点 |
| `STRUCTURED_DATA_JSON` | Structured Data | Error | 是 | JSON-LD 不是有效 JSON |
| `LINK_BROKEN` | Internal Links | Error | 是 | 内部链接目标不可用 |
| `HREFLANG_TARGET` | Hreflang | Error | 是 | hreflang 目标不存在 |
| `IMAGE_ALT_MISSING` | Images | Error | 是 | 图片缺少 alt 属性 |
| `CONTENT_LEAKAGE` | Compliance | Critical | 是 | 公开产物含内部或未审核标记 |
| `META_TITLE_DUPLICATE` | Metadata | Warning | 否 | title 重复候选 |
| `LINK_ORPHAN` | Internal Links | Warning | 否 | 页面没有入站链接 |
| `IMAGE_DIMENSIONS_MISSING` | Images | Warning | 否 | 图片缺少尺寸 |
| `DUPLICATE_BODY` | Content | Warning | 否 | 同语言正文重复候选 |
| `KEYWORD_MULTIPLE_PRIMARY` | Keywords | Notice | 否 | 多个 primary 页面候选 |

Google 官方要求、行业建议和项目内部策略不能混写：本表的“默认阻断”是 OKOCT 内部门禁，不是 Google 排名评分或处罚判断。重复内容、关键词冲突和 orphan 页面只产生人工审查候选。
