/**
 * Token estimate used for pack budgets.
 *
 * Deliberately dependency-free and deterministic: ~4 characters per token.
 * It is an estimate (±15% for English prose), not a model-specific count.
 * Budgets in packs are advisory; callers must report the estimate, never claim exactness.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function formatTokens(n: number): string {
  return n.toLocaleString("en-US");
}
