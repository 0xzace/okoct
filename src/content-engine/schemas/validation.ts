export type ValidationIssue = {
  code:
    "duplicate-id" | "duplicate-slug" | "duplicate-title" | "missing-reference";
  message: string;
  index: number;
};

type ReferenceRule<T> = {
  field: string;
  values: (item: T) => readonly string[];
  availableIds: ReadonlySet<string>;
};

export function validateEntitySet<T>(
  items: readonly T[],
  options: {
    id: (item: T) => string;
    slug?: (item: T) => string | undefined;
    title?: (item: T) => string | undefined;
    references?: readonly ReferenceRule<T>[];
  },
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const checkDuplicates = (
    selector: ((item: T) => string | undefined) | undefined,
    code: ValidationIssue["code"],
    label: string,
  ) => {
    if (!selector) return;
    const seen = new Map<string, number>();
    items.forEach((item, index) => {
      const value = selector(item);
      if (!value) return;
      const firstIndex = seen.get(value);
      if (firstIndex !== undefined) {
        issues.push({
          code,
          index,
          message: `${label} ${value} duplicates item ${firstIndex}.`,
        });
      } else {
        seen.set(value, index);
      }
    });
  };

  checkDuplicates(options.id, "duplicate-id", "ID");
  checkDuplicates(options.slug, "duplicate-slug", "Slug");
  checkDuplicates(options.title, "duplicate-title", "Title");

  for (const rule of options.references ?? []) {
    items.forEach((item, index) => {
      for (const value of rule.values(item)) {
        if (!rule.availableIds.has(value)) {
          issues.push({
            code: "missing-reference",
            index,
            message: `${rule.field} references missing entity ${value}.`,
          });
        }
      }
    });
  }

  return issues;
}
