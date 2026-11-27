import type { Locale } from "./config";

export type SiteDictionary = {
  languageName: string;
  languageSwitcherLabel: string;
  theme: {
    label: string;
    system: string;
    light: string;
    dark: string;
  };
  navigation: {
    home: string;
    about: string;
    safety: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    scopeLabel: string;
    scopeText: string;
    statusLabel: string;
    statusText: string;
    exploreLabel: string;
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
  };
};

const DICTIONARIES: Record<Locale, SiteDictionary> = {
  th: {
    languageName: "ไทย",
    languageSwitcherLabel: "ภาษา",
    theme: { label: "ธีม", system: "ระบบ", light: "สว่าง", dark: "มืด" },
    navigation: {
      home: "หน้าแรก",
      about: "เกี่ยวกับเรา",
      safety: "ขอบเขตความปลอดภัย",
    },
    home: {
      eyebrow: "ความรู้สุขภาพที่เป็นอิสระ",
      title: "ทำความเข้าใจสุขภาพอย่างมีข้อมูล",
      description:
        "OKOCT Health จัดทำข้อมูลสุขภาพสำหรับการเรียนรู้ โดยยึดแหล่งข้อมูลที่ตรวจสอบได้และขอบเขตที่ชัดเจน",
      scopeLabel: "ขอบเขตของเว็บไซต์",
      scopeText:
        "เว็บไซต์นี้ให้ความรู้ทั่วไป ไม่ใช่โรงพยาบาล คลินิก ร้านขายยา หรือบริการให้คำปรึกษาทางการแพทย์",
      statusLabel: "สถานะ V0.1",
      statusText:
        "โครงสร้างพื้นฐานอยู่ระหว่างการตรวจสอบ เนื้อหาทางการแพทย์อย่างเป็นทางการยังไม่เผยแพร่",
      exploreLabel: "อ่านเกี่ยวกับ OKOCT Health",
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
    footer: { disclaimer: "เนื้อหานี้มีไว้เพื่อการศึกษาเท่านั้น" },
  },
  en: {
    languageName: "English",
    languageSwitcherLabel: "Language",
    theme: { label: "Theme", system: "System", light: "Light", dark: "Dark" },
    navigation: { home: "Home", about: "About", safety: "Safety boundaries" },
    home: {
      eyebrow: "Independent health knowledge",
      title: "Understand health information with context",
      description:
        "OKOCT Health provides educational health information with verifiable sources and clear boundaries.",
      scopeLabel: "Website scope",
      scopeText:
        "This website provides general education. It is not a hospital, clinic, pharmacy, or medical consultation service.",
      statusLabel: "V0.1 status",
      statusText:
        "The foundation is under verification. No formal medical articles are published yet.",
      exploreLabel: "Learn about OKOCT Health",
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
    footer: { disclaimer: "Educational information only" },
  },
  "zh-Hans": {
    languageName: "简体中文",
    languageSwitcherLabel: "语言",
    theme: { label: "主题", system: "跟随系统", light: "浅色", dark: "深色" },
    navigation: { home: "首页", about: "关于我们", safety: "安全边界" },
    home: {
      eyebrow: "独立健康知识",
      title: "在完整语境中理解健康信息",
      description: "OKOCT Health 提供带有可验证来源和清晰边界的健康教育信息。",
      scopeLabel: "网站范围",
      scopeText:
        "本网站提供一般性健康教育，不是医院、诊所、药房或医疗咨询服务。",
      statusLabel: "V0.1 状态",
      statusText: "基础工程正在验证，暂未发布正式医学文章。",
      exploreLabel: "了解 OKOCT Health",
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
    footer: { disclaimer: "仅供教育参考" },
  },
};

export function getDictionary(locale: Locale): SiteDictionary {
  return DICTIONARIES[locale];
}
