# SEO Regression Standard

基线是带有 rule version、页面集合、索引资格、metadata、links、issues 和生成时间的 JSON 快照。`pnpm seo:compare` 输出新增、解决、变更问题以及严重级别变化。

新增 Critical/Error 默认阻断；Warning/Notice/Info 进入报告。基线更新必须通过显式命令或受审查的提交完成，不自动接受严重新增问题。基线不含 Search Console、排名或真实用户性能数据。
