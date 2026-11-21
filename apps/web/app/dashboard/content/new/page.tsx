import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import EditorClient from "../[id]/edit/editor-client";

export const dynamic = "force-dynamic";

export default async function NewDocPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  await requireUser();
  const { from } = await searchParams;
  const kb = getKb();
  const source = from ? kb.doc(from.toUpperCase()) : undefined;
  const id = source ? `${source.frontMatter.id}-COPY` : "NEW";
  return <EditorClient id={id} initialBody={source?.body ?? ""} isNew />;
}
