# 内容模型

## Collection

文章集合定义在 `src/content.config.ts`，使用 Astro Content Collections 的 glob loader 和 `src/schemas/content.ts` 的 Zod schema。V0.1 只有 `src/content/articles/v0-1-test-content.md`，且它是 `draft`、`test-only`、`indexable: false`。

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

## 生命周期

`draft` → `fact-check-pending` → `medical-review-pending` → `compliance-review-pending` → `translation-review-pending` → `approved` → `published` → `archived`。

只有 `published` 且满足 public/indexable、来源和审核字段的条目才具有发布资格。状态变更仍需要真实负责人操作和记录；自动化只阻止不满足结构条件的条目。

## 构建规则

1. `pnpm validate:content` 扫描 frontmatter。
2. 非 published 内容不能是 public 或 indexable。
3. V0.1 没有文章路由，测试 fixture 不会被页面引用。
4. `pnpm validate:seo` 搜索 `dist/`，阻止 fixture 文本和 slug 泄漏。
