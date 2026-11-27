# V0.3 内容架构

状态：V0.3 工程设计；正式医学内容审核仍为 Pending。

## 数据流

```text
关键词研究 → 搜索意图 → 主题/集群 → Content Brief → 草稿
    → 事实核查 → 医学审核 → 合规审核 → 翻译审核
    → 发布批准 → Fail-Closed Gate → Astro 静态页面
    → sitemap / hreflang / JSON-LD / Pagefind
```

## 数据所有权

| 目录                                      | 所有内容                             | 是否进入生产构建           |
| ----------------------------------------- | ------------------------------------ | -------------------------- |
| `src/content/articles/`                   | 文章正文和公开 frontmatter           | 仅通过发布门禁的记录       |
| `src/content/topics/`、`clusters/`        | 主题和集群元数据                     | 仅有公开文章覆盖时         |
| `src/content/authors/`、`reviewers/`      | 真实身份目录                         | 只以公开所需字段输出       |
| `src/content/references/`、`regulations/` | 参考来源和监管来源                   | 仅文章引用的公开元数据     |
| `src/content/keywords/`、`briefs/`        | 关键词和内容策划                     | 否，除非明确渲染为公开内容 |
| `editorial/`                              | 审核记录、批准、修订、纠错等内部证据 | 否                         |
| `seo-lab/`                                | 研究、SERP、竞争和缺口数据           | 否                         |
| `docs/evidence/`                          | 验证报告                             | 否                         |

同一实体只能有一个规范来源。页面不得直接读取 editorial 或 seo-lab 文件。

## 构建原则

- Git 是版本和变更历史；Astro Content Collections 是构建时内容入口；Zod 是边界校验。
- Repository 是生产读取的唯一入口，Publication Gate 是唯一公开资格判断。
- 空主题不自动生成索引页；未审核翻译不建立公开 hreflang 关系。
- V0.3 不引入数据库、独立后端、重量级 CMS、账号或敏感健康数据收集。
