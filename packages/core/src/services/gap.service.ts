import type { GapRecord, KbStore } from "../store/types";
import { KbError } from "../errors";

/** Record a missing topic. Repeated reports increment the same gap. */
export async function reportGap(
  store: KbStore,
  topic: string,
  context: string,
): Promise<GapRecord> {
  const cleanTopic = topic.trim();
  const cleanContext = context.trim();

  if (!cleanTopic) throw new KbError("INVALID_INPUT", "topic must not be empty.");
  if (cleanTopic.length > 200) {
    throw new KbError("INVALID_INPUT", "topic must be 200 characters or fewer.");
  }
  if (!cleanContext) {
    throw new KbError("INVALID_INPUT", "context must explain what was missing.");
  }
  if (cleanContext.length > 2000) {
    throw new KbError("INVALID_INPUT", "context must be 2000 characters or fewer.");
  }

  return store.upsertGap(cleanTopic, cleanContext);
}
