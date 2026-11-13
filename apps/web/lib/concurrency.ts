const MAX_CONCURRENCY = Number(process.env.MCP_MAX_CONCURRENCY ?? 32);

let active = 0;

/**
 * Per-instance concurrency guard. Serverless gives each instance its own
 * counter, so this bounds CPU/memory pressure rather than global throughput.
 * Returns a release function, or null when saturated.
 */
export function tryAcquire(): (() => void) | null {
  if (active >= MAX_CONCURRENCY) return null;
  active += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    active -= 1;
  };
}

export function activeRequests(): number {
  return active;
}
