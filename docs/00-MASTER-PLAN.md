# OKOCT Health 主计划

版本：V0.1.0<br>
日期：2026-11-27<br>
状态：V0.1 本地工程验收已完成；生产发布为 Pending

## 产品定位

OKOCT Health 是面向泰国市场的独立、非商业健康知识网站，支持泰语、英语和简体中文。网站提供一般性健康教育，不是医院、诊所、药房、处方服务、在线诊疗平台或药品商业推广渠道。

## V0.1 目标

1. 建立 Astro 静态生成和 TypeScript strict 基础。
2. 建立 `/th/`、`/en/`、`/zh/` 独立语言路由。
3. 建立统一 SEO 元数据、canonical、hreflang、JSON-LD、sitemap 和 robots.txt。
4. 建立 Content Collections + Zod 内容模型和发布资格门禁。
5. 建立语义 HTML、主题切换、键盘焦点和 reduced-motion 基础。
6. 建立单元测试、集成测试、E2E、内容验证、静态构建、Docker/Nginx 和 CI 配置。

## 当前状态

- 项目基础、i18n、SEO、内容门禁、页面布局、静态产物验证和部署配置：`VERIFIED`，证据见 [V0.1 验证记录](evidence/V0.1-VERIFICATION.md)。
- 正式医学文章：`PENDING`，V0.1 不发布。
- 专业事实核查、医学审核、合规审核和翻译审核：`PENDING`，不得由自动化测试替代。
- 生产 VPS、Nginx 线上配置、Cloudflare、DNS 和 Search Console：`PENDING`，没有执行生产变更。
- Core Web Vitals 和真实用户数据：`PENDING`，当前只有工程目标，没有性能达标声明。

## 版本边界

V0.2 可在完成内容治理和专业审核流程后，评估真实已审核内容、专题索引和搜索 UI。任何数据库、CMS、用户账号、商业化或医疗服务变更都需要新的需求、架构和法律评审。

## 关联文档

- [项目设计说明](superpowers/specs/2026-11-27-okoct-v0.1-design.md)
- [V0.1 实施计划](superpowers/plans/2026-11-27-okoct-v0.1-plan.md)
- [V0.1 任务状态](roadmap/V0.1-TASKS.md)
- [发布清单](compliance/RELEASE-CHECKLIST.md)
