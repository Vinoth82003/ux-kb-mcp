import type { ReactNode } from "react";

/**
 * Consistent page heading for every admin surface: eyebrow (optional),
 * title, one-line purpose, and a right-aligned action cluster.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="adm-page-head">
      <div className="adm-page-copy">
        {eyebrow && <p className="adm-eyebrow">{eyebrow}</p>}
        <h1 className="adm-title">{title}</h1>
        {description && <p className="adm-desc">{description}</p>}
      </div>
      {actions && <div className="adm-actions">{actions}</div>}
    </header>
  );
}
