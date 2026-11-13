# Architecture

MCP is the delivery layer; specialization comes from instructions, retrieval, topic quality, evaluation and feedback.

Layers: agent instructions; Markdown knowledge; MCP delivery; shared core services; Postgres persistence; independent critic/evals; Next.js admin.

Knowledge tiers: core always loaded; stage pack per workflow stage; topic docs on demand. Do not load the full catalogue. Proposal pack budget is 6,000 tokens including core; report actual tokenizer count and prioritize rather than silently overflow.

Core owns logic. MCP, REST and admin are thin wrappers using the same services. Agents read only published immutable releases. Sessions pin one release version for reproducibility.

**Phase 1–3 status:** content services read the Git-tracked Markdown in `content/` and report the version from `content/release.json`. Auth, sessions, usage, compliance and gaps go through a `KbStore` boundary with an in-memory implementation for tests/local dev and a Prisma implementation for Postgres; the MCP surface is identical either way. Retrieval still reads Markdown directly.
