# International SEO

## Locale registry

| Locale    | URL prefix | hreflang  | 默认 |
| --------- | ---------- | --------- | ---- |
| `th`      | `/th/`     | `th`      | 是   |
| `en`      | `/en/`     | `en`      | 否   |
| `zh-Hans` | `/zh/`     | `zh-Hans` | 否   |

## 关系规则

- 每个本地化页面使用自身 URL 作为 canonical。
- hreflang 只列出真实存在且允许索引的对应页面。
- 本地化页面生成 reciprocal alternates。
- `x-default` 指向根语言入口 `/`。
- 不生成不存在的 `/zh/safety/` 链接或 sitemap URL。
- metadata 文本由本地化字典提供，不把默认语言复制到所有页面。

## 翻译发布

翻译页面必须进入 `translation-review-pending`，通过专业翻译审核后才能与其他语言建立公开关系。V0.1 的页面文本是工程占位和产品边界说明，不代表正式医学文章翻译审核已经完成。

## 维护检查

新增页面时，必须同时更新路由定义、可用语言集合、页面静态路径、字典、SEO 测试和 sitemap 期望集合。
