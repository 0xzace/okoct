# SEO Quality Gate

`pnpm seo:gate` 在生产构建后运行。默认阻断：`Critical`、`Error`、内容泄露、无效 canonical、不可索引 sitemap、无效 hreflang 目标、结构化数据 JSON 错误、重定向环和关键内部断链。

`Warning`、`Notice`、`Info` 不会仅因数量增加而阻断构建，但必须进入报告。性能波动也不应造成无意义失败；只有明确配置的阈值才可阻断。

SEO 门禁不能替代医学、法律、隐私或翻译审核门禁。通过只表示当前本地构建满足已实现的技术规则，不表示 Google 收录、排名、富媒体展示或医疗内容批准。
