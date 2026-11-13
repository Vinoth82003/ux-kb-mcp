/**
 * Import the Markdown content layer into Postgres.
 *
 * Idempotent: docs are upserted; a new DocVersion row is only written when the
 * body hash changes. Packs and routes are replaced to mirror the files.
 */
import { createHash } from "node:crypto";
import { createKb } from "@ux-kb/core";
import { getPrisma } from "@ux-kb/core/db";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

async function main(): Promise<void> {
  const prisma = getPrisma();
  const kb = createKb({ strict: true });
  const release = kb.release();
  const docs = kb.docs();
  const packs = kb.repo.packs();
  const routes = kb.repo.routes();

  const snapshotDocs: Record<string, { rev: number; hash: string }> = {};

  for (const doc of docs) {
    const fm = doc.frontMatter;
    const contentHash = hash(doc.body);

    await prisma.doc.upsert({
      where: { id: fm.id },
      create: {
        id: fm.id,
        domain: fm.domain,
        group: fm.group ?? null,
        tags: fm.tags,
        stages: fm.stages,
        priority: fm.priority,
        appliesTo: fm.applies_to,
        sourceUrl: fm.sources[0]?.url ?? null,
      },
      update: {
        domain: fm.domain,
        group: fm.group ?? null,
        tags: fm.tags,
        stages: fm.stages,
        priority: fm.priority,
        appliesTo: fm.applies_to,
        sourceUrl: fm.sources[0]?.url ?? null,
      },
    });

    const latest = await prisma.docVersion.findFirst({
      where: { docId: fm.id },
      orderBy: { rev: "desc" },
    });

    let rev = latest?.rev ?? fm.rev;
    if (!latest || latest.contentHash !== contentHash) {
      rev = latest ? latest.rev + 1 : fm.rev;
      await prisma.docVersion.create({
        data: {
          docId: fm.id,
          rev,
          title: fm.title,
          summary: doc.summary,
          body: doc.body,
          status: fm.status,
          frontMatter: fm,
          contentHash,
        },
      });
    }

    snapshotDocs[fm.id] = { rev, hash: contentHash };
  }

  for (const [stage, pack] of packs) {
    await prisma.pack.upsert({
      where: { stage },
      create: {
        stage,
        docIds: pack.always,
        budgetTokens: pack.budget_tokens,
        includeCore: pack.include_core_md,
      },
      update: {
        docIds: pack.always,
        budgetTokens: pack.budget_tokens,
        includeCore: pack.include_core_md,
      },
    });
  }

  await prisma.route.deleteMany();
  if (routes.length > 0) {
    await prisma.route.createMany({
      data: routes.map((route) => ({ match: route.match, add: route.add })),
    });
  }

  const snapshot = {
    docs: snapshotDocs,
    packs: Object.fromEntries(
      [...packs].map(([stage, pack]) => [
        stage,
        { docIds: pack.always, budgetTokens: pack.budget_tokens },
      ]),
    ),
    routes,
    docCount: docs.length,
  };

  await prisma.release.updateMany({ data: { isActive: false } });
  await prisma.release.upsert({
    where: { version: release.version },
    create: {
      version: release.version,
      notes: release.notes,
      snapshot,
      isActive: release.isActive,
    },
    update: {
      notes: release.notes,
      snapshot,
      isActive: release.isActive,
    },
  });

  console.log(
    `Seeded ${docs.length} docs, ${packs.size} packs, ${routes.length} routes as ${release.version}.`,
  );
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await getPrisma().$disconnect();
  process.exitCode = 1;
});
