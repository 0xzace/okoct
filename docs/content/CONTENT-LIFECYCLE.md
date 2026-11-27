# 内容生命周期

## 状态

`planned` → `brief` → `draft` → `fact-check-pending` → `medical-review-pending` → `compliance-review-pending` → `translation-review-pending` → `approved` → `published`

已发布内容还可进入 `update-required`、`withdrawn` 或 `archived`。审核退回时回到 `draft`，不得跳过适用审核。

| 状态                | 公开 HTML           | Sitemap/Pagefind   | 说明                           |
| ------------------- | ------------------- | ------------------ | ------------------------------ |
| planned/brief/draft | 否                  | 否                 | 规划或未审核内容               |
| 任一 review-pending | 否                  | 否                 | 等待相应审核                   |
| approved            | 否                  | 否                 | 已批准但等待构建发布           |
| published           | 是，需再次通过 gate | 是，需满足索引条件 | 版本、hash、审核和引用必须匹配 |
| update-required     | 按风险决定          | 默认否             | 需要重新审核                   |
| withdrawn           | 否                  | 否                 | 支持紧急撤回                   |
| archived            | 按归档策略          | 默认否             | 不得作为新内容关系目标         |

## 重新审核规则

文章正文、标题、关键元数据、医学结论或关键参考资料改变时必须提升 revision 并重新计算 content hash。旧 ReviewRecord 只能保留为历史证据，不能满足新版本发布门禁。审核到期、被拒绝、审核人无效或范围不匹配时同样失效。

## 紧急撤回

撤回是 fail-closed 操作：将内容状态设为 `withdrawn`，使所有公开查询、相关链接、hreflang、sitemap 和 Pagefind 在下一次构建中移除。不能等待常规更新窗口。

实现入口：`src/content-engine/lifecycle/state-machine.ts`、`src/content-engine/review/invalidation.ts` 和 `src/content-engine/publication/gate.ts`。自动化测试使用明确隔离的合成审核记录，不能作为真实医学文章的批准证据。
