import type { Locale } from "./config";

export type TopicCardCopy = {
  title: string;
  text: string;
};

export type SiteDictionary = {
  languageName: string;
  languageSwitcherLabel: string;
  theme: {
    label: string;
    system: string;
    light: string;
    dark: string;
  };
  ui: {
    skipToContent: string;
    openSearch: string;
    closeSearch: string;
    search: string;
    loading: string;
    error: string;
    learnMore: string;
    backToHome: string;
  };
  navigation: {
    home: string;
    about: string;
    safety: string;
    search: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    exploreLabel: string;
    secondaryLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchHint: string;
    topicEyebrow: string;
    topicTitle: string;
    topicDescription: string;
    topicCards: TopicCardCopy[];
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDescription: string;
    featuredEmpty: string;
    glp1Eyebrow: string;
    glp1Title: string;
    glp1Description: string;
    glp1Empty: string;
    safetyEyebrow: string;
    safetyTitle: string;
    safetyText: string;
    safetyAction: string;
    researchEyebrow: string;
    researchTitle: string;
    researchText: string;
    researchEmpty: string;
    standardsEyebrow: string;
    standardsTitle: string;
    standardsText: string;
    standardsItems: string[];
    scopeLabel: string;
    scopeText: string;
    statusLabel: string;
    statusText: string;
  };
  search: {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    submit: string;
    hint: string;
    noResults: string;
    loading: string;
    error: string;
  };
  about: {
    title: string;
    description: string;
    body: string;
  };
  safety: {
    title: string;
    description: string;
    body: string;
    warning: string;
  };
  footer: {
    disclaimer: string;
    status: string;
  };
};

const DICTIONARIES: Record<Locale, SiteDictionary> = {
  th: {
    languageName: "ไทย",
    languageSwitcherLabel: "ภาษา",
    theme: { label: "ธีม", system: "ระบบ", light: "สว่าง", dark: "มืด" },
    ui: {
      skipToContent: "ข้ามไปยังเนื้อหา",
      openSearch: "เปิดการค้นหา",
      closeSearch: "ปิดการค้นหา",
      search: "ค้นหา",
      loading: "กำลังโหลด",
      error: "ไม่สามารถโหลดผลการค้นหาได้",
      learnMore: "เรียนรู้เพิ่มเติม",
      backToHome: "กลับสู่หน้าแรก",
    },
    navigation: {
      home: "หน้าแรก",
      about: "เกี่ยวกับเรา",
      safety: "ขอบเขตความปลอดภัย",
      search: "ค้นหา",
    },
    home: {
      eyebrow: "ความรู้สุขภาพที่เป็นอิสระ",
      title: "ทำความเข้าใจสุขภาพอย่างมีข้อมูล",
      description:
        "OKOCT Health ช่วยให้คุณอ่านข้อมูลสุขภาพอย่างมีบริบท โดยใช้แหล่งข้อมูลที่ตรวจสอบได้และขอบเขตที่ชัดเจน",
      exploreLabel: "สำรวจความรู้",
      secondaryLabel: "อ่านหลักการของเรา",
      searchLabel: "ค้นหาความรู้",
      searchPlaceholder: "ค้นหาข้อมูลที่เผยแพร่แล้ว",
      searchHint: "การค้นหาจะเริ่มมีผลเมื่อมีเนื้อหาที่ผ่านการตรวจสอบเผยแพร่",
      topicEyebrow: "สำรวจตามหัวข้อ",
      topicTitle: "เริ่มจากคำถามที่คุณต้องการเข้าใจ",
      topicDescription:
        "หัวข้อเหล่านี้เป็นกรอบการอ่าน ไม่ใช่คำแนะนำการรักษาหรือการวินิจฉัยเฉพาะบุคคล",
      topicCards: [
        { title: "พื้นฐานสุขภาพ", text: "แนวคิดและคำศัพท์ที่ช่วยอ่านข้อมูลสุขภาพได้ชัดขึ้น" },
        {
          title: "หลักฐานและบริบท",
          text: "วิธีอ่านแหล่งข้อมูล วันที่เผยแพร่ และข้อจำกัดของหลักฐาน",
        },
        {
          title: "ความปลอดภัยในการอ่าน",
          text: "ขอบเขตที่ชัดเจนระหว่างความรู้ทั่วไปกับการดูแลเฉพาะบุคคล",
        },
      ],
      featuredEyebrow: "ความรู้เด่น",
      featuredTitle: "เนื้อหาที่ผ่านการทบทวนกำลังเตรียมพร้อม",
      featuredDescription:
        "เราจะเผยแพร่เฉพาะเนื้อหาที่มีแหล่งอ้างอิงและผ่านการตรวจสอบตามขั้นตอนที่กำหนด",
      featuredEmpty: "ยังไม่มีบทความสุขภาพที่ผ่านการอนุมัติเพื่อเผยแพร่",
      glp1Eyebrow: "หัวข้อที่กำลังเตรียม",
      glp1Title: "GLP-1 และการจัดการน้ำหนัก",
      glp1Description:
        "หัวข้อนี้อยู่ในแผนการจัดทำความรู้ทั่วไป เมื่อมีแหล่งข้อมูลและการทบทวนที่เหมาะสม",
      glp1Empty: "ยังไม่มีบทความที่ผ่านการตรวจสอบในหัวข้อนี้",
      safetyEyebrow: "ขอบเขตและความปลอดภัย",
      safetyTitle: "ความรู้ทั่วไปไม่ใช่การดูแลเฉพาะบุคคล",
      safetyText:
        "เว็บไซต์นี้ไม่วินิจฉัยโรค ไม่ให้คำแนะนำการรักษาหรือขนาดยา ไม่จำหน่ายยา และไม่เก็บข้อมูลสุขภาพที่ละเอียดอ่อน",
      safetyAction: "อ่านขอบเขตความปลอดภัย",
      researchEyebrow: "พร้อมเมื่อหลักฐานพร้อม",
      researchTitle: "แหล่งข้อมูลต้องตรวจสอบย้อนกลับได้",
      researchText:
        "บทความในอนาคตจะระบุแหล่งอ้างอิง วันที่ตรวจสอบ และข้อจำกัดของข้อมูลอย่างชัดเจน",
      researchEmpty: "ยังไม่มีชุดข้อมูลหรือบทความวิจัยที่เผยแพร่ในระยะนี้",
      standardsEyebrow: "มาตรฐานบรรณาธิการ",
      standardsTitle: "อ่านอย่างระมัดระวังตั้งแต่ต้นทาง",
      standardsText:
        "ทุกหน้าต้องรักษาขอบเขตที่ชัดเจนระหว่างข้อมูลเพื่อการศึกษาและคำแนะนำจากผู้เชี่ยวชาญ",
      standardsItems: [
        "ใช้แหล่งอ้างอิงที่ตรวจสอบได้",
        "แสดงสถานะการทบทวนอย่างตรงไปตรงมา",
        "ไม่สัญญาผลลัพธ์หรือเก็บข้อมูลสุขภาพส่วนบุคคล",
      ],
      scopeLabel: "ขอบเขตของเว็บไซต์",
      scopeText:
        "เว็บไซต์นี้ให้ความรู้ทั่วไป ไม่ใช่โรงพยาบาล คลินิก ร้านขายยา หรือบริการให้คำปรึกษาทางการแพทย์",
      statusLabel: "สถานะ V0.2",
      statusText:
        "ระบบการออกแบบอยู่ระหว่างการตรวจสอบ เนื้อหาทางการแพทย์อย่างเป็นทางการยังไม่เผยแพร่",
    },
    search: {
      title: "ค้นหาความรู้",
      description: "ค้นหาหน้าเว็บและความรู้สุขภาพที่เผยแพร่โดย OKOCT Health",
      label: "ค้นหาใน OKOCT Health",
      placeholder: "พิมพ์คำค้น",
      submit: "ค้นหา",
      hint: "ยังไม่มีบทความสุขภาพที่ผ่านการอนุมัติ หากไม่พบผลลัพธ์ โปรดกลับมาอีกครั้งเมื่อมีเนื้อหาใหม่",
      noResults: "ไม่พบผลลัพธ์ที่ตรงกัน",
      loading: "กำลังค้นหา",
      error: "เกิดข้อผิดพลาดในการค้นหา",
    },
    about: {
      title: "เกี่ยวกับ OKOCT Health",
      description: "ขอบเขตและหลักการของเว็บไซต์ความรู้สุขภาพอิสระ OKOCT Health",
      body: "OKOCT Health เป็นเว็บไซต์ความรู้สุขภาพอิสระที่ไม่ใช่เชิงพาณิชย์ ข้อมูลทุกชิ้นต้องมีแหล่งอ้างอิงที่ตรวจสอบได้และผ่านการทบทวนที่เหมาะสมก่อนเผยแพร่",
    },
    safety: {
      title: "ขอบเขตความปลอดภัยและการปฏิบัติตามข้อกำหนด",
      description:
        "ข้อจำกัดด้านความปลอดภัย การแพทย์ และความเป็นส่วนตัวของ OKOCT Health",
      body: "เว็บไซต์นี้ไม่วินิจฉัยโรค ไม่ให้คำแนะนำการรักษาหรือขนาดยา ไม่จำหน่ายยา และไม่เก็บข้อมูลสุขภาพที่ละเอียดอ่อน",
      warning: "ข้อมูลทั่วไปไม่สามารถแทนที่การประเมินจากผู้เชี่ยวชาญด้านสุขภาพได้",
    },
    footer: {
      disclaimer: "เนื้อหานี้มีไว้เพื่อการศึกษาเท่านั้น",
      status: "ยังไม่มีเนื้อหาทางการแพทย์ที่เผยแพร่",
    },
  },
  en: {
    languageName: "English",
    languageSwitcherLabel: "Language",
    theme: { label: "Theme", system: "System", light: "Light", dark: "Dark" },
    ui: {
      skipToContent: "Skip to content",
      openSearch: "Open search",
      closeSearch: "Close search",
      search: "Search",
      loading: "Loading",
      error: "Search could not be loaded",
      learnMore: "Learn more",
      backToHome: "Back to home",
    },
    navigation: {
      home: "Home",
      about: "About",
      safety: "Safety boundaries",
      search: "Search",
    },
    home: {
      eyebrow: "Independent health knowledge",
      title: "Understand health information with context",
      description:
        "OKOCT Health helps you read health information with context, verifiable sources, and clear boundaries.",
      exploreLabel: "Explore knowledge",
      secondaryLabel: "Read our standards",
      searchLabel: "Search knowledge",
      searchPlaceholder: "Search published knowledge",
      searchHint: "Search will become useful as reviewed content is published.",
      topicEyebrow: "Explore by topic",
      topicTitle: "Start with the question you want to understand",
      topicDescription:
        "These topics are reading frames, not personal treatment or diagnostic advice.",
      topicCards: [
        {
          title: "Health foundations",
          text: "Concepts and terms that make health information easier to read.",
        },
        {
          title: "Evidence and context",
          text: "How to read sources, publication dates, and the limits of evidence.",
        },
        {
          title: "Reading safely",
          text: "A clear line between general knowledge and personal care.",
        },
      ],
      featuredEyebrow: "Featured knowledge",
      featuredTitle: "Reviewed content is being prepared",
      featuredDescription:
        "We publish only material with references and the required review record.",
      featuredEmpty:
        "No approved health articles are available for publication yet.",
      glp1Eyebrow: "Topic in preparation",
      glp1Title: "GLP-1 and weight management",
      glp1Description:
        "This topic is planned for general education when appropriate sources and reviews are ready.",
      glp1Empty: "No reviewed articles are available for this topic yet.",
      safetyEyebrow: "Scope and safety",
      safetyTitle: "General knowledge is not personal care",
      safetyText:
        "This website does not diagnose conditions, provide treatment or dosage recommendations, sell medicines, or collect sensitive health information.",
      safetyAction: "Read safety boundaries",
      researchEyebrow: "Ready when the evidence is ready",
      researchTitle: "Sources should be traceable",
      researchText:
        "Future articles will show references, review dates, and the limits of available information.",
      researchEmpty:
        "No research collection or medical articles are published at this stage.",
      standardsEyebrow: "Editorial standards",
      standardsTitle: "Careful reading starts at the source",
      standardsText:
        "Every page keeps a visible boundary between educational information and advice from a qualified professional.",
      standardsItems: [
        "Use verifiable references",
        "Show review status plainly",
        "Do not promise outcomes or collect personal health data",
      ],
      scopeLabel: "Website scope",
      scopeText:
        "This website provides general education. It is not a hospital, clinic, pharmacy, or medical consultation service.",
      statusLabel: "V0.2 status",
      statusText:
        "The design system is under verification. No formal medical articles are published yet.",
    },
    search: {
      title: "Search knowledge",
      description:
        "Search pages and health knowledge published by OKOCT Health.",
      label: "Search OKOCT Health",
      placeholder: "Type a search term",
      submit: "Search",
      hint: "No approved health articles are published yet. Return later as reviewed content becomes available.",
      noResults: "No matching results found.",
      loading: "Searching",
      error: "Search could not be completed.",
    },
    about: {
      title: "About OKOCT Health",
      description:
        "The scope and principles of the independent OKOCT Health knowledge website.",
      body: "OKOCT Health is an independent, non-commercial health knowledge website. Every future article must have verifiable references and appropriate human review before publication.",
    },
    safety: {
      title: "Safety and compliance boundaries",
      description:
        "The medical safety, privacy, and product boundaries of OKOCT Health.",
      body: "This website does not diagnose conditions, provide treatment or dosage recommendations, sell medicines, or collect sensitive health information.",
      warning:
        "General information cannot replace an assessment by a qualified health professional.",
    },
    footer: {
      disclaimer: "Educational information only",
      status: "No formal medical content published",
    },
  },
  "zh-Hans": {
    languageName: "简体中文",
    languageSwitcherLabel: "语言",
    theme: { label: "主题", system: "跟随系统", light: "浅色", dark: "深色" },
    ui: {
      skipToContent: "跳转到正文",
      openSearch: "打开搜索",
      closeSearch: "关闭搜索",
      search: "搜索",
      loading: "正在加载",
      error: "无法加载搜索结果",
      learnMore: "了解更多",
      backToHome: "返回首页",
    },
    navigation: {
      home: "首页",
      about: "关于我们",
      safety: "安全边界",
      search: "搜索",
    },
    home: {
      eyebrow: "独立健康知识",
      title: "在完整语境中理解健康信息",
      description:
        "OKOCT Health 帮助你在完整语境中阅读健康信息，关注可验证来源和清晰边界。",
      exploreLabel: "探索健康知识",
      secondaryLabel: "阅读编辑标准",
      searchLabel: "搜索知识",
      searchPlaceholder: "搜索已发布的知识",
      searchHint: "随着经过审核的内容发布，搜索会逐渐变得有用。",
      topicEyebrow: "按主题探索",
      topicTitle: "从你想理解的问题开始",
      topicDescription: "这些主题是阅读框架，不是个体化治疗或诊断建议。",
      topicCards: [
        { title: "健康基础", text: "帮助你读懂健康信息的概念和术语。" },
        {
          title: "证据与语境",
          text: "了解如何阅读来源、发布日期和证据的局限。",
        },
        { title: "安全阅读", text: "清楚区分一般知识与个体化照护。" },
      ],
      featuredEyebrow: "精选知识",
      featuredTitle: "经过审核的内容正在准备中",
      featuredDescription: "我们只发布带有参考资料并完成必要审核记录的内容。",
      featuredEmpty: "目前还没有获得发布批准的健康文章。",
      glp1Eyebrow: "正在准备的主题",
      glp1Title: "GLP-1 与体重管理",
      glp1Description:
        "当合适的来源和审核准备就绪后，我们会提供这个主题的一般性知识。",
      glp1Empty: "这个主题目前还没有经过审核的文章。",
      safetyEyebrow: "范围与安全",
      safetyTitle: "一般知识不是个体化照护",
      safetyText:
        "本网站不进行疾病诊断，不提供治疗或剂量建议，不销售药品，也不收集敏感健康信息。",
      safetyAction: "阅读安全边界",
      researchEyebrow: "证据准备好时再发布",
      researchTitle: "来源应当可以追溯",
      researchText: "未来文章会清晰列出参考资料、审核日期和现有信息的局限。",
      researchEmpty: "当前阶段还没有发布研究集合或医学文章。",
      standardsEyebrow: "编辑标准",
      standardsTitle: "从来源开始认真阅读",
      standardsText: "每个页面都要清楚区分教育信息与合格专业人员提供的建议。",
      standardsItems: [
        "使用可验证的参考资料",
        "清楚展示审核状态",
        "不承诺结果，也不收集个人健康数据",
      ],
      scopeLabel: "网站范围",
      scopeText:
        "本网站提供一般性健康教育，不是医院、诊所、药房或医疗咨询服务。",
      statusLabel: "V0.2 状态",
      statusText: "设计系统正在验证，暂未发布正式医学文章。",
    },
    search: {
      title: "搜索知识",
      description: "搜索 OKOCT Health 已发布的页面和健康知识。",
      label: "搜索 OKOCT Health",
      placeholder: "输入搜索词",
      submit: "搜索",
      hint: "目前还没有发布经过批准的健康文章。随着审核内容上线，请稍后再来。",
      noResults: "没有找到匹配结果。",
      loading: "正在搜索",
      error: "搜索无法完成。",
    },
    about: {
      title: "关于 OKOCT Health",
      description: "独立 OKOCT Health 健康知识网站的范围和原则。",
      body: "OKOCT Health 是独立、非商业的健康知识网站。未来每篇文章都必须具备可验证参考资料，并经过适当的人工审核后才能发布。",
    },
    safety: {
      title: "安全与合规边界",
      description: "OKOCT Health 的医疗安全、隐私和产品边界。",
      body: "本网站不进行疾病诊断，不提供治疗或剂量建议，不销售药品，也不收集敏感健康信息。",
      warning: "一般信息不能替代合格医疗专业人员的评估。",
    },
    footer: { disclaimer: "仅供教育参考", status: "暂未发布正式医学内容" },
  },
};

export function getDictionary(locale: Locale): SiteDictionary {
  return DICTIONARIES[locale];
}
