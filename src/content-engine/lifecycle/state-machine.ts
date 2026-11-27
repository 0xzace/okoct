import type { ContentState } from "../schemas/entities";

const TRANSITIONS: Record<ContentState, readonly ContentState[]> = {
  planned: ["brief"],
  brief: ["draft"],
  draft: ["fact-check-pending"],
  "fact-check-pending": ["draft", "medical-review-pending"],
  "medical-review-pending": ["draft", "compliance-review-pending"],
  "compliance-review-pending": ["draft", "translation-review-pending"],
  "translation-review-pending": ["draft", "approved"],
  approved: ["draft", "published"],
  published: ["update-required", "withdrawn", "archived"],
  "update-required": ["draft"],
  withdrawn: ["draft"],
  archived: [],
};

export type LifecycleEvent = {
  articleId: string;
  from: ContentState;
  to: ContentState;
  revision: number;
  actor: string;
  occurredAt: Date;
};

export function canTransition(from: ContentState, to: ContentState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function transitionLifecycle(
  record: { id: string; state: ContentState; revision: number },
  to: ContentState,
  actor: string,
  occurredAt: Date,
): LifecycleEvent {
  if (!canTransition(record.state, to)) {
    throw new Error(`Invalid lifecycle transition: ${record.state} -> ${to}`);
  }

  return {
    articleId: record.id,
    from: record.state,
    to,
    revision: record.revision,
    actor,
    occurredAt,
  };
}
