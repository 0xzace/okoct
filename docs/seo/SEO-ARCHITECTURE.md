# V0.4 SEO Architecture

状态：V0.4 工程实现中；正式医学内容、Search Console、真实用户性能和生产发布仍为 Pending。

## 数据流

```text
Content Engine -> Publication Gate -> Astro dist -> SEO Crawler
                                             -> page snapshots
                                             -> SEO analyzers
                                             -> audit report
                                             -> regression comparison
                                             -> SEO quality gate
```

SEO Engine 只读取已生成的本地 `dist/` 或明确指定的本地 HTTP 预览，不直接读取或发布 `editorial/`、`seo-lab/` 和未通过内容门禁的实体。现有 `src/seo` 继续负责页面生成期的 metadata、URL、JSON-LD、sitemap 和 hreflang；`scripts/seo/engine.mjs` 负责构建后的可观测验证。

## 运行边界

- 静态审计默认使用 `dist/`，同源、有限数量、确定性 URL。
- HTTP 爬取只接受显式 origin，并限制深度、页数和超时。
- 审计结果是项目内部质量证据，不代表 Google 已收录、排名或富媒体资格。
- 性能报告区分 Lighthouse 实验室结果与真实用户 Core Web Vitals。

## 产物

`pnpm seo:audit` 写入被 Git 忽略的 `seo-lab/reports/`；V0.4 基线快照显式保存于 `seo-lab/baselines/seo-audit.json`。报告可被 CI 作为 artifact 上传。
