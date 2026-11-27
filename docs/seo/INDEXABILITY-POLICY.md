# Indexability Policy

技术可索引条件为 HTTP 200、无 `noindex`、页面可解析且 canonical 目标有效。`robots.txt` 不是保密机制；草稿、审核资料和内部记录必须不进入构建产物。

本地审计状态：`Indexable`、`Non-indexable`、`Redirected`、`Unavailable`。这些状态描述本地技术条件，不描述 Google 实际收录状态。预览环境应使用访问控制，并可通过 noindex 防止误收录。
