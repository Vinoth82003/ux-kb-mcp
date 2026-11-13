"use client";

import { useEffect, useState } from "react";

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
type ThemeMode = "system" | "light" | "dark";
type ComparisonView = "both" | "before" | "after";

export default function Landing() {
  const [tab, setTab] = useState<Tab>("stdio");
  const [copied, setCopied] = useState<string | null>(null);
  const [mode, setMode] = useState<ThemeMode>("system");
  const [menuOpen, setMenuOpen] = useState(false);
  const [comparisonView, setComparisonView] = useState<ComparisonView>("both");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme-mode");
    if (stored === "light" || stored === "dark" || stored === "system") setMode(stored);
  }, []);

  useEffect(() => {
    const resolve = () =>
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode;
    document.documentElement.setAttribute("data-theme", resolve());
    window.localStorage.setItem("theme-mode", mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

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

  const cycleMode = () => {
    setMode((m) => (m === "system" ? "light" : m === "light" ? "dark" : "system"));
  };

  const modeLabel = mode === "system" ? "System" : mode === "light" ? "Light" : "Dark";

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="UX-KB home">
            <img
              className="brand-mark"
              src="/mascot/pose-01-brand-mark.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              decoding="async"
            />
            <span className="brand-name">UX-KB</span>
          </a>
          <nav className="site-nav" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#tools">Tools</a>
            <a href="#connect">Connect</a>
            <a href="#testing">Testing</a>
            <a href="#showcase">Before &amp; After</a>
            <button className="theme-toggle" type="button" onClick={cycleMode} aria-label={`Theme: ${modeLabel}. Click to change.`}>
              <span aria-hidden="true" className="theme-icon">
                {mode === "light" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                ) : mode === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                )}
              </span>
              {modeLabel}
            </button>
            <a className="nav-cta" href="/signin">
              Sign in
            </a>
            <a className="nav-cta nav-cta-primary" href="https://github.com/Vinoth82003/ux-kb-mcp" rel="noopener">
              GitHub
            </a>
          </nav>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
          {menuOpen && (
            <div id="mobile-menu" className="mobile-menu" role="dialog" aria-label="Navigation menu">
              <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#tools" onClick={() => setMenuOpen(false)}>Tools</a>
              <a href="#connect" onClick={() => setMenuOpen(false)}>Connect</a>
              <a href="#testing" onClick={() => setMenuOpen(false)}>Testing</a>
              <a href="#showcase" onClick={() => setMenuOpen(false)}>Before &amp; After</a>
              <button className="theme-toggle" type="button" onClick={cycleMode} aria-label={`Theme: ${modeLabel}. Click to change.`}>
                <span aria-hidden="true" className="theme-icon">
                  {mode === "light" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                  ) : mode === "dark" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  )}
                </span>
                {modeLabel}
              </button>
              <a className="nav-cta" href="/signin" onClick={() => setMenuOpen(false)}>
                Sign in
              </a>
              <a className="nav-cta nav-cta-primary" href="https://github.com/Vinoth82003/ux-kb-mcp" rel="noopener" onClick={() => setMenuOpen(false)}>
                GitHub
              </a>
            </div>
          )}
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="container hero-inner">
            <div>
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
                <a className="btn btn-secondary" href="#connect">
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
            <aside className="citation-card" aria-label="Example citation verification">
              <img
                className="section-mascot mascot-hero"
                src="/mascot/pose-02-confident-expert.svg"
                alt="UX-KB Guide mascot, confident expert pose"
                width={280}
                height={256}
                loading="eager"
                decoding="async"
              />
              <div className="card-head">
                <p className="card-title">verify_citations</p>
                <span className="badge badge-success">passed</span>
              </div>
              <div className="citation-row">
                <span className="citation-id">CMP-001</span>
                <span className="citation-text">Buttons — fetched this session</span>
              </div>
              <div className="citation-row">
                <span className="citation-id">VIS-003</span>
                <span className="citation-text">Color theory — fetched this session</span>
              </div>
              <div className="citation-row">
                <span className="citation-id">A11Y-002</span>
                <span className="citation-text">Color contrast — fetched this session</span>
              </div>
              <div className="citation-verify">
                <span className="ok">all cited IDs verified</span> · 0 unfetched · 0 unknown · 0 deprecated
              </div>
            </aside>
          </div>
          <div className="hero-grid" aria-hidden="true"></div>
        </section>

        <section className="problem">
          <div className="container problem-grid">
            <div>
              <h2>The problem</h2>
              <p className="problem-lead">
                Generic AI UI looks like a template because the model is guessing — with no source,
                no fetch history, and no way to check.
              </p>
              <img
                className="section-mascot mascot-problem"
                src="/mascot/pose-03-observer.svg"
                alt="UX-KB Guide mascot, observer pose"
                width={180}
                height={165}
                loading="lazy"
                decoding="async"
              />
            </div>
            <ul className="problem-list">
              <li>
                <strong>Invented rules</strong>
                <span>Models hallucinate UX guidance, spacing, and accessibility advice with no source.</span>
              </li>
              <li>
                <strong>Prompt bloat</strong>
                <span>Pasting an entire style guide into every prompt wastes tokens and drifts over time.</span>
              </li>
              <li>
                <strong>Uncited proposals</strong>
                <span>Reviewers cannot tell which rules a design actually followed.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="how" id="how">
          <div className="container">
            <div className="section-header section-header-right">
              <div className="section-header-copy">
                <h2>How it works</h2>
                <p className="section-lede">Four steps, one session, every claim traceable.</p>
              </div>
              <img
                className="section-mascot mascot-how"
                src="/mascot/pose-04-instructor.svg"
                alt="UX-KB Guide mascot, instructor pose"
                width={180}
                height={165}
                loading="lazy"
                decoding="async"
              />
            </div>
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
            <div className="section-header section-header-left">
              <img
                className="section-mascot mascot-inside"
                src="/mascot/pose-05-knowledge-keeper.svg"
                alt="UX-KB Guide mascot, knowledge keeper pose"
                width={180}
                height={165}
                loading="lazy"
                decoding="async"
              />
              <div className="section-header-copy">
                <h2>What&apos;s inside</h2>
                <p className="section-lede">
                  A comprehensive, structured knowledge base covering design tokens, accessibility, and SaaS patterns.
                </p>
              </div>
            </div>
            <div className="stat-grid">
              <div className="stat">
                <strong>73</strong>
                <span>topic docs</span>
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
            <div className="section-header section-header-right">
              <div className="section-header-copy">
                <h2>Tool reference</h2>
                <p className="section-lede">
                  Seven tools, three resources. Search returns metadata; retrieve the full doc before relying on a rule.
                </p>
              </div>
              <img
                className="section-mascot mascot-tools"
                src="/mascot/pose-06-technical-specialist.svg"
                alt="UX-KB Guide mascot, technical specialist pose"
                width={140}
                height={128}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="table-scroll">
            <table className="tools-table">
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Input</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tool-name">start_session</td>
                  <td className="tool-sig">feature</td>
                  <td className="tool-desc">Creates a session; returns ID, KB version, suggested docs.</td>
                </tr>
                <tr>
                  <td className="tool-name">get_stage_pack</td>
                  <td className="tool-sig">sessionId, stage</td>
                  <td className="tool-desc">Core rules + stage docs + routed docs; records fetches.</td>
                </tr>
                <tr>
                  <td className="tool-name">get_doc</td>
                  <td className="tool-sig">sessionId, id</td>
                  <td className="tool-desc">One published document by ID.</td>
                </tr>
                <tr>
                  <td className="tool-name">search_kb</td>
                  <td className="tool-sig">query, domain?, limit?</td>
                  <td className="tool-desc">Ranked ID / title / summary hits.</td>
                </tr>
                <tr>
                  <td className="tool-name">get_checklist</td>
                  <td className="tool-sig">ids[]</td>
                  <td className="tool-desc">CHECK items only. Retrieving is not performing.</td>
                </tr>
                <tr>
                  <td className="tool-name">verify_citations</td>
                  <td className="tool-sig">sessionId, citedIds[]</td>
                  <td className="tool-desc">Unfetched, unknown, and deprecated IDs.</td>
                </tr>
                <tr>
                  <td className="tool-name">report_gap</td>
                  <td className="tool-sig">topic, context</td>
                  <td className="tool-desc">Upserts a missing-topic report.</td>
                </tr>
              </tbody>
            </table>
            </div>
            <p className="resources">
              Resources: <code>kb://doc/{"{id}"}</code>, <code>kb://pack/{"{stage}"}</code>, <code>kb://core</code>.
            </p>
          </div>
        </section>

        <section className="connect" id="connect">
          <div className="container">
            <div className="section-header section-header-left">
              <img
                className="section-mascot mascot-connect"
                src="/mascot/pose-07-integration-assistant.svg"
                alt="UX-KB Guide mascot, integration assistant pose"
                width={180}
                height={165}
                loading="lazy"
                decoding="async"
              />
              <div className="section-header-copy">
                <h2>Connect an agent</h2>
                <p className="section-lede">
                  Hook into Claude Code, Cursor, Claude Desktop, or custom HTTP clients in minutes.
                </p>
              </div>
            </div>
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
                {copied === "stdio" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className={`panel ${tab === "desktop" ? "is-active" : ""}`} hidden={tab !== "desktop"}>
              <pre>
                <code>{CODE_DESKTOP}</code>
              </pre>
              <button className="copy" type="button" onClick={() => copy("desktop", CODE_DESKTOP)}>
                {copied === "desktop" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className={`panel ${tab === "http" ? "is-active" : ""}`} hidden={tab !== "http"}>
              <pre>
                <code>{CODE_HTTP}</code>
              </pre>
              <button className="copy" type="button" onClick={() => copy("http", CODE_HTTP)}>
                {copied === "http" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                  </>
                )}
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
            <div className="section-header section-header-right">
              <div className="section-header-copy">
                <h2>Why it is different</h2>
                <p className="section-lede">
                  Every citation is tied to real session history — preventing hallucinated guidelines.
                </p>
              </div>
              <img
                className="section-mascot mascot-why"
                src="/mascot/pose-08-guardian.svg"
                alt="UX-KB Guide mascot, guardian pose"
                width={180}
                height={165}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="why-grid">
              <div className="why-item">
                <strong>Citations tied to fetch history.</strong>
                <span><code>verify_citations</code> flags unfetched, unknown, and deprecated IDs before submission.</span>
              </div>
              <div className="why-item">
                <strong>Stage budgets.</strong>
                <span>Packs report token estimates and mark over-budget packs instead of silently overflowing.</span>
              </div>
              <div className="why-item">
                <strong>Session ownership.</strong>
                <span>Sessions belong to the API key that created them; another key gets <code>SESSION_FORBIDDEN</code>.</span>
              </div>
              <div className="why-item">
                <strong>Release pinning.</strong>
                <span>A key can be frozen to a release; mismatched deployments return <code>409</code>.</span>
              </div>
              <div className="why-item">
                <strong>Gap reporting.</strong>
                <span>Missing topics are recorded with counts instead of being papered over.</span>
              </div>
              <div className="why-item">
                <strong>Reviewed Markdown is the trust boundary.</strong>
                <span>A bad doc is the risk; review is the control.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="arch">
          <div className="container">
            <div className="section-header section-header-left">
              <img
                className="section-mascot mascot-arch"
                src="/mascot/pose-09-engineer.svg"
                alt="UX-KB Guide mascot, engineer pose"
                width={160}
                height={146}
                loading="lazy"
                decoding="async"
              />
              <div className="section-header-copy">
                <h2>Architecture</h2>
                <p className="section-lede">
                  Core owns the logic; MCP, REST, and admin are thin wrappers over the same services.
                </p>
              </div>
            </div>
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
            <div className="section-header section-header-right">
              <div className="section-header-copy">
                <h2>Testing</h2>
                <p className="section-lede">
                  Validated against 73 docs with 0 errors, full typecheck coverage, and end-to-end smoke tests.
                </p>
              </div>
              <img
                className="section-mascot mascot-testing"
                src="/mascot/pose-10-quality-inspector.svg"
                alt="UX-KB Guide mascot, quality inspector pose"
                width={160}
                height={146}
                loading="lazy"
                decoding="async"
              />
            </div>
            <pre className="testing-pre">
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

        <section className="showcase" id="showcase">
          <div className="container">
            <div className="section-header section-header-left">
              <img
                className="section-mascot mascot-showcase"
                src="/mascot/pose-11-helpful-companion.svg"
                alt="UX-KB Guide mascot, helpful companion pose"
                width={170}
                height={155}
                loading="lazy"
                decoding="async"
              />
              <div className="section-header-copy">
                <p className="eyebrow">Design Evolution</p>
                <h2>Website Redesign: Before &amp; After</h2>
                <p className="section-lede">
                  Comparing the initial dark developer prototype with the redesigned evidence-backed platform.
                </p>
              </div>
            </div>

            <div className="comparison-controls" role="tablist" aria-label="Comparison display options">
              <button
                type="button"
                className={`comparison-tab ${comparisonView === "both" ? "is-active" : ""}`}
                onClick={() => setComparisonView("both")}
                aria-selected={comparisonView === "both"}
              >
                Side by side
              </button>
              <button
                type="button"
                className={`comparison-tab ${comparisonView === "before" ? "is-active" : ""}`}
                onClick={() => setComparisonView("before")}
                aria-selected={comparisonView === "before"}
              >
                Before redesign
              </button>
              <button
                type="button"
                className={`comparison-tab ${comparisonView === "after" ? "is-active" : ""}`}
                onClick={() => setComparisonView("after")}
                aria-selected={comparisonView === "after"}
              >
                After redesign
              </button>
            </div>

            <div className={`comparison-grid ${comparisonView !== "both" ? "is-single" : ""}`}>
              {(comparisonView === "both" || comparisonView === "before") && (
                <div className="comparison-card">
                  <div className="comparison-card-header">
                    <span className="comparison-badge badge-before">Before Redesign</span>
                    <h3>Initial Prototype</h3>
                    <p className="comparison-desc">
                      Minimalist dark developer aesthetic with basic monospace metrics and unguided layout.
                    </p>
                  </div>
                  <div className="comparison-image-wrapper">
                    <img
                      src="/before.png"
                      alt="UX-KB initial prototype website before redesign with dark theme and no mascot"
                      width={1185}
                      height={698}
                      loading="lazy"
                      className="comparison-img"
                    />
                  </div>
                  <ul className="comparison-features">
                    <li>Fixed dark palette without system theme detection</li>
                    <li>No mascot companion or visual guidance</li>
                    <li>Basic monospace stats without interactive verification</li>
                  </ul>
                </div>
              )}

              {(comparisonView === "both" || comparisonView === "after") && (
                <div className="comparison-card comparison-card-highlight">
                  <div className="comparison-card-header">
                    <span className="comparison-badge badge-after">After Redesign</span>
                    <h3>Evidence-Backed Platform</h3>
                    <p className="comparison-desc">
                      Warm token-driven theme system with persistent theme switching and mascot storytelling.
                    </p>
                  </div>
                  <div className="comparison-image-wrapper">
                    <img
                      src="/after.png"
                      alt="UX-KB redesigned website with warm theme, cat mascot guide, and verified citations preview"
                      width={1218}
                      height={697}
                      loading="lazy"
                      className="comparison-img"
                    />
                  </div>
                  <ul className="comparison-features">
                    <li>System-aware light &amp; dark theme token architecture</li>
                    <li>Friendly cat mascot companion throughout every stage</li>
                    <li>Live interactive citation verification card preview</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <div className="section-header section-header-right">
              <div className="section-header-copy">
                <h2>Frequently Asked Questions</h2>
                <p className="section-lede">Quick answers about integration, licensing, and design systems.</p>
              </div>
              <img
                className="section-mascot mascot-faq"
                src="/mascot/pose-12-friendly-companion.svg"
                alt="UX-KB Guide mascot, friendly companion pose"
                width={150}
                height={137}
                loading="lazy"
                decoding="async"
              />
            </div>
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
          <div className="footer-brand-row">
            <img className="footer-mascot" src="/mascot/pose-01-brand-mark.svg" alt="" loading="lazy" decoding="async" aria-hidden="true" width={40} height={40} />
            <div>
              <p className="footer-brand">UX-KB</p>
              <p className="footer-note">Content release candidate 1.0.0-rc.1 · 73 topic docs · MIT license</p>
            </div>
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