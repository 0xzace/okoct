# 内容模型

## V0.3 规范来源

`src/content-engine/schemas/entities.ts` 是实体 schema 的规范实现；本文档说明所有实体的用途和公开边界。`src/content/` 是构建时公开内容入口，`editorial/` 和 `seo-lab/` 是非公开记录，不能被页面直接读取。

## Collection

文章集合定义在 `src/content.config.ts`，使用 Astro Content Collections 的 glob loader 和 Zod schema。当前 `src/content/articles/v0-1-test-content.md` 是 `draft`、`test-only`、`indexable: false`；V0.3 不把规划 brief 当成公开文章。

## 字段

| 字段                        | 类型                  | 说明                           |
| --------------------------- | --------------------- | ------------------------------ |
| `title`                     | string                | 本地化标题                     |
| `description`               | string                | 页面摘要                       |
| `locale`                    | `th \| en \| zh-Hans` | 内容语言                       |
| `state`                     | lifecycle enum        | 内容生命周期                   |
| `visibility`                | `test-only \| public` | 构建可见性                     |
| `indexable`                 | boolean               | 是否允许进入索引               |
| `sources`                   | URL[]                 | 可验证参考资料                 |
| `author`                    | string                | 真实作者记录，不能由系统伪造   |
| `medicalReviewer`           | string                | 真实审核人记录，不能由系统伪造 |
| `factCheckedAt`             | date                  | 事实核查时间                   |
| `medicallyReviewedAt`       | date                  | 医学审核时间                   |
| `complianceReviewedAt`      | date                  | 合规审核时间                   |
| `translationReviewedAt`     | date                  | 翻译审核时间                   |
| `publishedAt` / `updatedAt` | date                  | 发布和更新记录                 |

V0.3 文章还必须绑定 `id`、`translationKey`、`slug`、`type`、`topicId`、`clusterId`、`contentBriefId`、`revision` 和 `contentHash`。审核、批准、修订和纠错记录必须能解析到这些字段。

实体 schema 的代码入口为 `src/content-engine/schemas/entities.ts`，通用重复和关系校验为 `src/content-engine/schemas/validation.ts`。当前首批 topic/cluster/keyword/brief 为非公开 planning registry，不代表已发布医学内容。

## 生命周期

`planned` → `brief` → `draft` → `fact-check-pending` → `medical-review-pending` → `compliance-review-pending` → `translation-review-pending` → `approved` → `published` → `update-required` / `withdrawn` / `archived`。

只有 `published` 且满足 public/indexable、来源、当前 revision/hash、真实审核记录和发布批准的条目才具有发布资格。状态变更仍需要真实负责人操作和记录；自动化只阻止不满足结构条件的条目，不能授予医学或法律批准。

## 构建规则

1. `pnpm validate:content` 扫描 frontmatter。
2. 非 published 内容不能是 public 或 indexable。
3. V0.1 没有文章路由，测试 fixture 不会被页面引用。
4. `pnpm validate:seo` 搜索 `dist/`，阻止 fixture 文本和 slug 泄漏。
