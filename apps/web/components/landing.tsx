"use client";

import { useState } from "react";

const CODE_STDIO = `claude mcp add ux-kb -- node --import tsx \\
  /absolute/path/to/ux-kb/apps/stdio/src/index.ts`;

const CODE_DESKTOP = `{
  "mcpServers": {
    "ux-kb": {
      "command": "node",
      "args": ["--import", "tsx", "/absolute/path/to/ux-kb/apps/stdio/src/index.ts"]
    }
  }
}`;

const CODE_HTTP = `# create a key at https://ux-kb-site.vercel.app/dashboard/keys
claude mcp add --transport http ux-kb https://ux-kb-site.vercel.app/api/mcp \\
  --header "Authorization: Bearer <your-key>"`;

type Tab = "stdio" | "desktop" | "http";

export default function Landing() {
  const [tab, setTab] = useState<Tab>("stdio");
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied("fail");
      setTimeout(() => setCopied(null), 1400);
    }
  }

  const codeMap: Record<Tab, string> = { stdio: CODE_STDIO, desktop: CODE_DESKTOP, http: CODE_HTTP };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="UX-KB home">
            <span className="brand-mark" aria-hidden="true">
              UX
            </span>
            <span className="brand-name">KB</span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#tools">Tools</a>
            <a href="#connect">Connect</a>
            <a href="#testing">Testing</a>
            <a className="nav-cta" href="/signin">
              Sign in
            </a>
            <a className="nav-cta" href="https://github.com/Vinoth82003/ux-kb-mcp" rel="noopener">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="container hero-inner">
            <p className="eyebrow">Cloud MCP knowledge base · v1.0.0-rc.1</p>
            <h1>
              UX knowledge your AI agent can <span className="accent">cite</span>.
            </h1>
            <p className="lede">
              A versioned, queryable UI/UX knowledge base delivered over the Model Context
              Protocol. 73 cited topic docs, 6 workflow stage packs, session-scoped retrieval,
              and citation verification — so proposals rest on fetched rules instead of
              invented ones.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="https://github.com/Vinoth82003/ux-kb-mcp">
                View on GitHub
              </a>
              <a className="btn btn-ghost" href="#connect">
                Connect in 2 minutes
              </a>
            </div>
            <ul className="hero-stats" aria-label="Project stats">
              <li>
                <strong>73</strong>
                <span>topic docs</span>
              </li>
              <li>
                <strong>6</strong>
                <span>stage packs</span>
              </li>
              <li>
                <strong>7</strong>
                <span>MCP tools</span>
              </li>
              <li>
                <strong>35</strong>
                <span>unit tests</span>
              </li>
            </ul>
          </div>
          <div className="hero-grid" aria-hidden="true"></div>
        </section>

        <section className="problem">
          <div className="container">
            <h2>The problem</h2>
            <p className="section-lede">Generic AI UI looks like a template because the model is guessing.</p>
            <div className="card-grid three">
              <article className="card">
                <h3>Invented rules</h3>
                <p>Models hallucinate UX guidance, spacing, and accessibility advice with no source.</p>
              </article>
              <article className="card">
                <h3>Prompt bloat</h3>
                <p>Pasting an entire style guide into every prompt wastes tokens and drifts over time.</p>
              </article>
              <article className="card">
                <h3>Uncited proposals</h3>
                <p>Reviewers cannot tell which rules a design actually followed.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="how" id="how">
          <div className="container">
            <h2>How it works</h2>
            <p className="section-lede">Four steps, one session, every claim traceable.</p>
            <ol className="steps">
              <li>
                <span className="step-num">01</span>
                <h3>Start a session</h3>
                <p>
                  Call <code>start_session</code> with the feature. The server returns a session ID, the KB version, and feature-routed doc IDs.
                </p>
              </li>
              <li>
                <span className="step-num">02</span>
                <h3>Load a stage pack</h3>
                <p>
                  Call <code>get_stage_pack</code> before each stage. Core rules plus stage docs, within a token budget.
                </p>
              </li>
              <li>
                <span className="step-num">03</span>
                <h3>Fetch what you need</h3>
                <p>
                  Use <code>search_kb</code> and <code>get_doc</code> for extra topics. Only fetched IDs can be cited.
                </p>
              </li>
              <li>
                <span className="step-num">04</span>
                <h3>Verify citations</h3>
                <p>
                  Call <code>verify_citations</code> before submitting. It flags unfetched, unknown, and deprecated IDs.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="inside">
          <div className="container">
            <h2>What&apos;s inside</h2>
            <div className="stat-grid">
              <div className="stat">
                <strong>73</strong>
                <span>topic documents</span>
              </div>
              <div className="stat">
                <strong>6</strong>
                <span>stage packs</span>
              </div>
              <div className="stat">
                <strong>10</strong>
                <span>feature routes</span>
              </div>
              <div className="stat">
                <strong>7</strong>
                <span>MCP tools</span>
              </div>
              <div className="stat">
                <strong>3</strong>
                <span>resources</span>
              </div>
              <div className="stat">
                <strong>35</strong>
                <span>unit tests</span>
              </div>
            </div>
            <p className="inside-note">
              Domains: visual, components, interaction, accessibility, responsive, information
              architecture, UX writing, design systems, evaluation, SaaS patterns.
            </p>
          </div>
        </section>

        <section className="tools" id="tools">
          <div className="container">
            <h2>Tool reference</h2>
            <p className="section-lede">
              Seven tools, three resources. Search returns metadata; retrieve the full doc before relying on a rule.
            </p>
            <div className="tool-grid">
              <article className="tool">
                <h3>start_session</h3>
                <p>
                  <code>feature</code>
                </p>
                <span>Creates a session; returns ID, KB version, suggested docs.</span>
              </article>
              <article className="tool">
                <h3>get_stage_pack</h3>
                <p>
                  <code>sessionId, stage</code>
                </p>
                <span>Core rules + stage docs + routed docs; records fetches.</span>
              </article>
              <article className="tool">
                <h3>get_doc</h3>
                <p>
                  <code>sessionId, id</code>
                </p>
                <span>One published document by ID.</span>
              </article>
              <article className="tool">
                <h3>search_kb</h3>
                <p>
                  <code>query, domain?, limit?</code>
                </p>
                <span>Ranked ID / title / summary hits.</span>
              </article>
              <article className="tool">
                <h3>get_checklist</h3>
                <p>
                  <code>ids[]</code>
                </p>
                <span>CHECK items only. Retrieving is not performing.</span>
              </article>
              <article className="tool">
                <h3>verify_citations</h3>
                <p>
                  <code>sessionId, citedIds[]</code>
                </p>
                <span>Unfetched, unknown, and deprecated IDs.</span>
              </article>
              <article className="tool">
                <h3>report_gap</h3>
                <p>
                  <code>topic, context</code>
                </p>
                <span>Upserts a missing-topic report.</span>
              </article>
            </div>
            <p className="resources">
              Resources: <code>kb://doc/{"{id}"}</code>, <code>kb://pack/{"{stage}"}</code>, <code>kb://core</code>.
            </p>
          </div>
        </section>

        <section className="connect" id="connect">
          <div className="container">
            <h2>Connect an agent</h2>
            <div className="tabs" role="tablist" aria-label="Connection methods">
              <button
                className={`tab ${tab === "stdio" ? "is-active" : ""}`}
                role="tab"
                aria-selected={tab === "stdio"}
                onClick={() => setTab("stdio")}
              >
                Claude Code (stdio)
              </button>
              <button
                className={`tab ${tab === "desktop" ? "is-active" : ""}`}
                role="tab"
                aria-selected={tab === "desktop"}
                onClick={() => setTab("desktop")}
              >
                Cursor / Claude Desktop
              </button>
              <button
                className={`tab ${tab === "http" ? "is-active" : ""}`}
                role="tab"
                aria-selected={tab === "http"}
                onClick={() => setTab("http")}
              >
                Streamable HTTP
              </button>
            </div>

            <div className={`panel ${tab === "stdio" ? "is-active" : ""}`} hidden={tab !== "stdio"}>
              <pre>
                <code>{CODE_STDIO}</code>
              </pre>
              <button className="copy" type="button" onClick={() => copy("stdio", CODE_STDIO)}>
                {copied === "stdio" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className={`panel ${tab === "desktop" ? "is-active" : ""}`} hidden={tab !== "desktop"}>
              <pre>
                <code>{CODE_DESKTOP}</code>
              </pre>
              <button className="copy" type="button" onClick={() => copy("desktop", CODE_DESKTOP)}>
                {copied === "desktop" ? "Copied" : "Copy"}
              </button>
            </div>

            <div className={`panel ${tab === "http" ? "is-active" : ""}`} hidden={tab !== "http"}>
              <pre>
                <code>{CODE_HTTP}</code>
              </pre>
              <button className="copy" type="button" onClick={() => copy("http", CODE_HTTP)}>
                {copied === "http" ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="connect-note">
              stdio needs no API key — it provisions an internal <code>stdio-local</code> key.
              HTTP requires a Bearer key and enforces revocation, version pinning, and a
              per-key rate limit.
            </p>
          </div>
        </section>

        <section className="why">
          <div className="container">
            <h2>Why it is different</h2>
            <ul className="why-list">
              <li>
                <strong>Citations are tied to fetch history.</strong>{" "}
                <code>verify_citations</code> flags unfetched, unknown, and deprecated IDs before submission.
              </li>
              <li>
                <strong>Stage budgets.</strong> Packs report token estimates and mark over-budget packs instead of silently overflowing.
              </li>
              <li>
                <strong>Session ownership.</strong> Sessions belong to the API key that created them; another key gets{" "}
                <code>SESSION_FORBIDDEN</code>.
              </li>
              <li>
                <strong>Release pinning.</strong> A key can be frozen to a release; mismatched deployments return{" "}
                <code>409</code>.
              </li>
              <li>
                <strong>Gap reporting.</strong> Missing topics are recorded with counts instead of being papered over.
              </li>
              <li>
                <strong>Reviewed Markdown is the trust boundary.</strong> A bad doc is the risk; review is the control.
              </li>
            </ul>
          </div>
        </section>

        <section className="arch">
          <div className="container">
            <h2>Architecture</h2>
            <pre className="arch-diagram">
              <code>{`Agent  ->  MCP Server (stdio / HTTP)
            ->  Core Services
                ->  Content Repository  ->  Markdown content/
                ->  KbStore
                    ->  MemoryStore (dev/tests)
                    ->  PrismaStore (Postgres)
                ->  Auth, rate limit, sessions, citations, gaps`}</code>
            </pre>
            <p className="arch-note">Core owns the logic; MCP, REST, and admin are thin wrappers over the same services.</p>
          </div>
        </section>

        <section className="testing" id="testing">
          <div className="container">
            <h2>Testing</h2>
            <pre>
              <code>{`pnpm lint:kb:strict   # 0 errors, 0 warnings across 73 docs
pnpm typecheck        # tsc, both packages
pnpm test             # 35 core unit tests
pnpm build            # builds stdio + web
pnpm smoke            # stdio end-to-end (7 tools + 3 resources)
pnpm smoke:http       # HTTP auth, pinning, revocation, 429`}</code>
            </pre>
            <p>
              See{" "}
              <a href="https://github.com/Vinoth82003/ux-kb-mcp/blob/main/docs/testing.md">docs/testing.md</a> for the full
              manual guide.
            </p>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2>FAQ</h2>
            <details>
              <summary>Does this replace my design system?</summary>
              <p>No. Project design-system files override the KB on tokens, brand, components, and voice. UX-KB supplies general UX rules.</p>
            </details>
            <details>
              <summary>Do I need Postgres?</summary>
              <p>No. The server reads Markdown directly. Postgres persists API keys, sessions, usage, compliance, and gaps.</p>
            </details>
            <details>
              <summary>Is it free and self-hostable?</summary>
              <p>Yes. MIT licensed. Run it locally over stdio or HTTP, or host the Node server yourself.</p>
            </details>
            <details>
              <summary>Can it hallucinate rules?</summary>
              <p>
                It is instructed to cite fetched IDs and to call <code>report_gap</code> instead of inventing rules for
                missing topics.
              </p>
            </details>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-brand">UX-KB</p>
            <p className="footer-note">Content release candidate 1.0.0-rc.1 · 73 topic docs · MIT license</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <a href="https://github.com/Vinoth82003/ux-kb-mcp">GitHub</a>
            <a href="https://github.com/Vinoth82003/ux-kb-mcp/blob/main/docs/setup.md">Setup</a>
            <a href="https://github.com/Vinoth82003/ux-kb-mcp/blob/main/docs/mcp-contract.md">MCP contract</a>
            <a href="https://github.com/Vinoth82003/ux-kb-mcp/blob/main/LICENSE">License</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
