# V0.3 关键词策略

关键词数据采用 Git 管理的 YAML/JSON 记录，支持 `candidate`、`researched`、`validated`、`mapped`、`rejected`、`archived` 状态。每条记录至少包含 ID、关键词、locale、market、Google、intent、topic/cluster、页面映射、研究来源、研究日期和合规分类。

未知 search volume、keyword difficulty 和 CPC 必须为 `null`。没有真实来源的记录不能变成 `researched` 或 `validated`。泰语拼写、医学术语和商业意图需要人工审核；V0.3 不接入付费关键词 API。

关键词用于服务搜索意图、内容 brief、主题覆盖和蚕食检测，不以关键词密度或字数定义医学内容质量。
