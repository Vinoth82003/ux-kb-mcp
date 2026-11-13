# Data Model and Release Snapshot

Entities: Doc (stable ID/domain/tags/stages/priority); DocVersion (immutable body/revision/status/author); Release (version/notes/active/snapshot); Pack (stage/doc IDs); Route (match/add); ApiKey (hashed key/pinned version/rate limit/revocation); Session (feature/fetched IDs); UsageLog (tool/latency/result); Compliance (unfetched/unknown IDs); KbGap (topic/context/count); AuditLog (actor/action/target).

A release snapshot includes exact doc versions, packs, routes, core and anti-slop versions, source metadata and release notes. Snapshots are immutable; one active release unless deliberate channels are added. Sessions remain pinned. Foreign IDs fail publication. Rollback activates a previous snapshot; it never rewrites history.
