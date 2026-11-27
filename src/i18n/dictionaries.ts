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
    label: string;
    home: string;
    about: string;
    safety: string;
    search: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
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
    horizon: {
      label: string;
      step: string;
      source: string;
      context: string;
      review: string;
    };
    topicEyebrow: string;
    topicTitle: string;
    topicDescription: string;
    topicCards: TopicCardCopy[];
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDescription: string;
    safetyEyebrow: string;
    safetyTitle: string;
    safetyText: string;
    safetyAction: string;
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
    resultCount: {
      one: string;
      other: string;
    };
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
      label: "การนำทางหลัก",
      home: "หน้าแรก",
      about: "เกี่ยวกับเรา",
      safety: "ขอบเขตความปลอดภัย",
      search: "ค้นหา",
      menu: "เมนู",
      openMenu: "เปิดเมนู",
      closeMenu: "ปิดเมนู",
    },
    home: {
      eyebrow: "ความรู้สุขภาพอิสระสำหรับประเทศไทย",
      title: "เข้าใจวิทยาศาสตร์ของการจัดการน้ำหนัก",
      description:
        "OKOCT Health กำลังเตรียมความรู้สุขภาพเกี่ยวกับ GLP-1 การฉีดยาลดน้ำหนัก ความปลอดภัยของยา และการจัดการน้ำหนักในประเทศไทย เนื้อหาที่ผ่านการทบทวนจะเผยแพร่หลังการตรวจสอบโดยมนุษย์",
      exploreLabel: "สำรวจความรู้",
      secondaryLabel: "อ่านหลักการของเรา",
      searchLabel: "ค้นหาความรู้",
      searchPlaceholder: "ค้นหาข้อมูลที่เผยแพร่แล้ว",
      searchHint: "การค้นหาจะเริ่มมีผลเมื่อมีเนื้อหาที่ผ่านการตรวจสอบเผยแพร่",
      horizon: {
        label: "เส้นขอบฟ้าของหลักฐาน",
        step: "01—03",
        source: "แหล่งข้อมูล",
        context: "บริบท",
        review: "การทบทวน",
      },
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
      featuredTitle: "เนื้อหาที่ผ่านการทบทวน",
      featuredDescription:
        "เราจะเผยแพร่เฉพาะเนื้อหาที่มีแหล่งอ้างอิงและผ่านการตรวจสอบตามขั้นตอนที่กำหนด",
      safetyEyebrow: "ขอบเขตและความปลอดภัย",
      safetyTitle: "ความรู้ทั่วไปไม่ใช่การดูแลเฉพาะบุคคล",
      safetyText:
        "เว็บไซต์นี้ไม่วินิจฉัยโรค ไม่ให้คำแนะนำการรักษาหรือขนาดยา ไม่จำหน่ายยา และไม่เก็บข้อมูลสุขภาพที่ละเอียดอ่อน",
      safetyAction: "อ่านขอบเขตความปลอดภัย",
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
      resultCount: { one: "{count} ผลลัพธ์", other: "{count} ผลลัพธ์" },
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
      label: "Primary navigation",
      home: "Home",
      about: "About",
      safety: "Safety boundaries",
      search: "Search",
      menu: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    home: {
      eyebrow: "Independent health knowledge for Thailand",
      title: "Understand the science of weight management",
      description:
        "OKOCT Health is preparing independent health knowledge about GLP-1, weight loss injections, medication safety, and weight management in Thailand. Reviewed articles will be published only after human review.",
      exploreLabel: "Explore knowledge",
      secondaryLabel: "Read our standards",
      searchLabel: "Search knowledge",
      searchPlaceholder: "Search published knowledge",
      searchHint: "Search will become useful as reviewed content is published.",
      horizon: {
        label: "Evidence horizon",
        step: "01—03",
        source: "Source",
        context: "Context",
        review: "Review",
      },
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
      featuredTitle: "Reviewed knowledge",
      featuredDescription:
        "We publish only material with references and the required review record.",
      safetyEyebrow: "Scope and safety",
      safetyTitle: "General knowledge is not personal care",
      safetyText:
        "This website does not diagnose conditions, provide treatment or dosage recommendations, sell medicines, or collect sensitive health information.",
      safetyAction: "Read safety boundaries",
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
      resultCount: { one: "{count} result", other: "{count} results" },
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
      label: "主导航",
      home: "首页",
      about: "关于我们",
      safety: "安全边界",
      search: "搜索",
      menu: "菜单",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    home: {
      eyebrow: "面向泰国的独立健康知识",
      title: "理解体重管理的科学",
      description:
        "OKOCT Health 正在准备关于 GLP-1、减重注射、用药安全和泰国体重管理的一般性健康知识。经过审核的文章只会在完成人工审核后发布。",
      exploreLabel: "探索健康知识",
      secondaryLabel: "阅读编辑标准",
      searchLabel: "搜索知识",
      searchPlaceholder: "搜索已发布的知识",
      searchHint: "随着经过审核的内容发布，搜索会逐渐变得有用。",
      horizon: {
        label: "证据地平线",
        step: "01—03",
        source: "来源",
        context: "语境",
        review: "审核",
      },
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
      featuredTitle: "经过审核的知识",
      featuredDescription: "我们只发布带有参考资料并完成必要审核记录的内容。",
      safetyEyebrow: "范围与安全",
      safetyTitle: "一般知识不是个体化照护",
      safetyText:
        "本网站不进行疾病诊断，不提供治疗或剂量建议，不销售药品，也不收集敏感健康信息。",
      safetyAction: "阅读安全边界",
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
      resultCount: { one: "{count} 条结果", other: "{count} 条结果" },
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
