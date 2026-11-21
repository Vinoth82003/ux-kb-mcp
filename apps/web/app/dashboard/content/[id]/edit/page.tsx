import { getKb } from "@/lib/kb";
import { requireUser } from "@/lib/authz";
import { notFound } from "next/navigation";
import EditorClient from "./editor-client";

export const dynamic = "force-dynamic";

export default async function EditDocPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const kb = getKb();
  const doc = kb.doc(id.toUpperCase());
  if (!doc) notFound();
  return <EditorClient id={doc.frontMatter.id} initialBody={doc.body} />;
}
