import type { Reference } from "../schemas/entities";
import { canonicalReferenceKey } from "./validation";

export function deduplicateReferences(
  references: readonly Reference[],
): Reference[] {
  const seen = new Set<string>();
  const result: Reference[] = [];

  for (const reference of references) {
    const key = canonicalReferenceKey(reference) ?? `id:${reference.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(reference);
  }

  return result;
}
