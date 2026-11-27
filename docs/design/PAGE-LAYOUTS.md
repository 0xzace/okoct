# V0.2 页面布局

## BaseLayout

统一输出 `html`、主题初始化、SEO head、skip link、header、main、breadcrumbs 和 footer。任何页面不得重复实现 SEO head。

## 首页

顺序固定为 Global Header → Hero → Knowledge Search → Topic Explorer → Featured Knowledge → GLP-1 Knowledge readiness → Safety and Awareness → Research readiness → Editorial Standards → Global Footer。没有真实文章时使用诚实空状态。

## 内容模板

- `PageLayout`：一般信息页。
- `ArticleLayout`：文章标题、元信息、正文、来源和相关文章。
- `TopicLayout`：专题说明和文章网格。
- `LegalLayout`：法律、隐私和免责声明页面。
- `ErrorLayout`：404 和其他错误状态。

这些模板只负责页面结构和 slot，不复制 `BaseLayout` 的 metadata 逻辑。

## 响应式

验证宽度为 320、375、390、768、1024、1280、1440、1920px。任何宽度都不应出现横向滚动、重叠或文本裁切。
