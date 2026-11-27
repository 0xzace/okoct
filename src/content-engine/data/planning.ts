import type {
  Cluster,
  ContentBrief,
  Keyword,
  Topic,
} from "../schemas/entities";

const topicSeeds = [
  ["TOP-001", "weight-loss-injections", "Weight Loss Injections", "P0"],
  ["TOP-002", "glp-1-science", "GLP-1 Science", "P0"],
  ["TOP-003", "medication-ingredients", "Medication Ingredients", "P0"],
  ["TOP-004", "medication-safety", "Medication Safety", "P0"],
  ["TOP-005", "weight-management", "Weight Management", "P0"],
  ["TOP-006", "thailand-regulations", "Thailand Regulations", "P0"],
  ["TOP-007", "clinical-research", "Clinical Research", "P1"],
  ["TOP-008", "medical-glossary", "Medical Glossary", "P1"],
] as const;

export const INITIAL_TOPICS: Topic[] = topicSeeds.map(
  ([id, slug, title, priority]) => ({
    id,
    slug,
    locale: "en",
    title,
    description: `${title} educational topic planning record.`,
    state: "planned",
    priority,
  }),
);

const clusterSeeds = [
  ["CLUSTER-001", "weight-loss-injections", "TOP-001"],
  ["CLUSTER-002", "glp-1", "TOP-002"],
  ["CLUSTER-003", "ingredients", "TOP-003"],
  ["CLUSTER-004", "medication-safety", "TOP-004"],
  ["CLUSTER-005", "weight-management", "TOP-005"],
  ["CLUSTER-006", "thailand-regulations", "TOP-006"],
] as const;

export const INITIAL_CLUSTERS: Cluster[] = clusterSeeds.map(
  ([id, slug, topicId]) => ({
    id,
    slug,
    locale: "en",
    title: `${slug} cluster`,
    description: `${slug} cluster planning record.`,
    state: "planned",
    topicId,
    pillarArticleId: null,
  }),
);

const seedKeywords = [
  ["KW-TH-0001", "ปากกาลดน้ำหนัก", "th", "TOP-001"],
  ["KW-TH-0002", "ยาฉีดลดน้ำหนัก", "th", "TOP-001"],
  ["KW-TH-0003", "GLP-1 คืออะไร", "th", "TOP-002"],
  ["KW-TH-0004", "ผลข้างเคียงของปากกาลดน้ำหนัก", "th", "TOP-004"],
  ["KW-EN-0001", "Weight loss injections", "en", "TOP-001"],
  ["KW-EN-0002", "What is GLP-1", "en", "TOP-002"],
  ["KW-EN-0003", "Semaglutide", "en", "TOP-003"],
  ["KW-EN-0004", "Tirzepatide", "en", "TOP-003"],
  ["KW-EN-0005", "Liraglutide", "en", "TOP-003"],
  ["KW-EN-0006", "Medication safety", "en", "TOP-004"],
] as const;

export const INITIAL_KEYWORDS: Keyword[] = seedKeywords.map(
  ([id, keyword, locale, topicId]) => ({
    id,
    keyword,
    locale,
    market: "TH",
    searchEngine: "google",
    intent: "informational",
    topicId,
    clusterId: null,
    primaryPageId: null,
    secondaryPageIds: [],
    status: "candidate",
    compliance: {
      status: "pending",
      commercialIntent: false,
      medicalReviewRequired: true,
    },
    research: {
      status: "pending",
      searchVolume: null,
      keywordDifficulty: null,
      cpc: null,
      serpFeatures: [],
      source: null,
      researchedAt: null,
    },
  }),
);

const briefTitles = [
  "What Are Weight Loss Injections?",
  "What Is GLP-1?",
  "Understanding Weight Management",
  "Understanding Medication Safety",
  "Understanding Prescription Medications",
  "Semaglutide: An Educational Overview",
  "Tirzepatide: An Educational Overview",
  "Liraglutide: An Educational Overview",
  "Understanding Drug Regulation in Thailand",
  "Counterfeit Medication Awareness",
  "How to Understand Clinical Evidence",
  "Common Misconceptions About Weight Loss Injections",
] as const;

export const INITIAL_BRIEFS: ContentBrief[] = briefTitles.map(
  (proposedTitle, index) => ({
    id: `BRIEF-${String(index + 1).padStart(6, "0")}`,
    locale: "en",
    market: "TH",
    topicId: INITIAL_TOPICS[index % INITIAL_TOPICS.length]?.id ?? "TOP-001",
    clusterId:
      INITIAL_CLUSTERS[index % INITIAL_CLUSTERS.length]?.id ?? "CLUSTER-001",
    searchIntent: "informational",
    primaryKeywordId:
      INITIAL_KEYWORDS[index % INITIAL_KEYWORDS.length]?.id ?? "KW-EN-0001",
    secondaryKeywordIds: [],
    targetAudience: "Readers seeking general health education.",
    contentObjective:
      "Explain the topic using verifiable sources and clear limitations.",
    proposedTitle,
    proposedUrl: proposedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    articleOutline: [
      "Scope and definitions",
      "Evidence and limitations",
      "Safety and when to seek professional advice",
    ],
    userQuestions: [
      "What does this term mean?",
      "What are the limits of the evidence?",
    ],
    evidenceRequirements: ["Use verifiable official or academic sources."],
    referenceRequirements: ["Record source URL or DOI and access date."],
    internalLinkOpportunities: [],
    complianceRisks: ["Avoid diagnosis, treatment or dosage recommendations."],
    medicalReviewRequired: true,
    acceptanceCriteria: [
      "All material claims have traceable references.",
      "Professional review remains pending until assigned.",
    ],
    status: "brief",
  }),
);
