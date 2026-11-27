# Technical SEO Specification

## 页面快照契约

每个快照包含 URL、HTTP 状态、语言、title、description、robots、canonical、hreflang、内部链接、图片、JSON-LD、heading、正文摘要和响应头。URL 仅允许配置的站点 origin，hash 被移除，目录式页面使用尾斜杠。

## 规则结果契约

每条问题必须包含：`ruleId`、`category`、`severity`、`url`、`description`、`evidence`、`suggestedFix`、`detectedAt` 和 `ruleVersion`。等级为 `Critical`、`Error`、`Warning`、`Notice`、`Info`。

## 页面资格

本地工具只判断技术上可索引（HTTP 200、无 noindex、可解析页面）。它不宣称 Google 已经收录，也不把 canonical 当成强制索引命令。

## 元数据

title、description、canonical 和语言关系必须来自实际页面内容。长度只作为可配置提示，不作为 Google 固定字符限制。搜索页和错误页可以 noindex，不进入 sitemap。
