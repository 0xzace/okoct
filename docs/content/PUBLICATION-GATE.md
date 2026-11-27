# 内容发布门禁

门禁采用 Fail-Closed。只有所有适用条件为真时，文章才可作为生产内容返回：

- schema、ID、slug、locale 和关系有效；
- 作者和审核人员身份已验证；
- 必需参考资料存在并处于适当验证状态；
- 事实、医学、合规和翻译审核记录均针对当前 revision 和 content hash；
- 审核未过期，决定为通过，范围覆盖当前内容；
- 发布批准记录与当前 revision/hash 匹配；
- 状态为 `published`、visibility 为 `public` 且明确 `indexable: true`。

门禁失败时内容必须从 HTML、sitemap、RSS、Pagefind、JSON-LD、hreflang、首页、专题页、相关内容、公共 API 和静态构建产物全部排除。不能通过环境变量、CLI 开关或缺少审核人时的临时 bypass 关闭门禁。

自动化门禁只验证结构、记录和关系，不能证明医学事实、法律意见或真实身份。

实现入口：`src/content-engine/publication/gate.ts` 和 `src/content-engine/publication/build-filter.ts`。生产查询还必须经过 `src/content-engine/repository/`；现有 V0.1 fixture 没有 V0.3 实体证据，因此继续保持排除。
