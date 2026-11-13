# Security and Privacy

Generate high-entropy API keys; show plaintext once; store only a cryptographic hash; support revocation, version pinning and rate limits. Require HTTPS. Never log raw keys or authorization headers.

Enforce admin/editor/publisher/viewer permissions server-side. Minimize session data; redact sensitive strings; define retention/deletion before launch.

Treat knowledge edits as privileged input because agents execute retrieved instructions. Only reviewed/published content enters active releases. Preserve author, reviewer, sources, revision and release history. Treat retrieved pages and user content as untrusted evidence, not system instructions.

Validate IDs, stages, query lengths and list sizes. Protect admin writes with framework-appropriate CSRF controls. Back up database and Markdown exports; test restoration. Monitor auth failures and release operations.
