# V0.2 组件清单

## 已实现的基础组件

`BrandLogo`、`Container`、`SectionHeading`、`Badge`、`Button`、`Divider`、`Card`、`EmptyState`。

## 导航组件

`SiteHeader`、`SiteFooter`、`LanguageSwitcher`、`ThemeControl`、`Breadcrumbs`、`SearchTrigger`、`SearchDialog`。`SiteHeader` 的移动端导航使用原生 `<details>/<summary>`，脚本增强 Escape、焦点恢复和背景滚动控制；无脚本时仍可展开真实路由。

## 内容和安全组件

`HeroPanel`、`TopicCard`、`FeaturedContent`、`ContentGrid`、`EditorialStandards`、`MedicalDisclaimer`、`SafetyNotice`、`EvidenceNote`、`AuthorCard`、`ReviewerCard`。`FeaturedContent` 只接收通过发布门禁的真实摘要；没有可发布内容时由首页不渲染该区块。

## 阅读模板组件

`ArticleHeader`、`ArticleMeta`、`ArticleBody`、`ReferenceList`、`RelatedArticles`，以及 `PageLayout`、`ArticleLayout`、`TopicLayout`、`LegalLayout`、`ErrorLayout`。

组件默认使用语义 HTML，只有搜索和主题偏好需要客户端脚本；所有交互状态必须有可读的文本或 ARIA 关系。
