/**
 * Instruction/data separation (§13).
 *
 * Documents are data. At build time we refuse to carry imperative
 * tool-use instructions ("call X tool", "ignore previous instructions") and
 * links outside the allow-listed source domains. The same scanner powers the
 * injection test suite.
 */

export interface SanitizerFinding {
  code: "INJECTION_PHRASE" | "TOOL_DIRECTIVE" | "UNSAFE_MARKUP" | "DISALLOWED_URL";
  message: string;
  match: string;
  index: number;
}

interface Pattern {
  code: SanitizerFinding["code"];
  pattern: RegExp;
  message: string;
}

const INSTRUCTION_PATTERNS: Pattern[] = [
  {
    code: "INJECTION_PHRASE",
    pattern: /\bignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions?|prompts?|rules?)\b/gi,
    message: "Document tries to override prior instructions.",
  },
  {
    code: "INJECTION_PHRASE",
    pattern: /\bdisregard\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions?|prompts?|rules?)\b/gi,
    message: "Document tries to discard prior instructions.",
  },
  {
    code: "INJECTION_PHRASE",
    pattern: /\b(?:reveal|print|output)\s+(?:the\s+)?(?:system|developer)\s+(?:prompt|message)\b/gi,
    message: "Document asks for the system prompt.",
  },
  {
    code: "INJECTION_PHRASE",
    pattern: /\byou\s+are\s+now\s+(?:a|an|the)\b/gi,
    message: "Document attempts to redefine the agent's role.",
  },
  {
    code: "INJECTION_PHRASE",
    pattern: /\b(?:begin|end)\s+system\s+prompt\b/gi,
    message: "Document contains a fake system-prompt delimiter.",
  },
  {
    code: "TOOL_DIRECTIVE",
    pattern: /\b(?:call|invoke|execute|run)\s+(?:the\s+)?[`'"]?[a-z][\w.-]*[`'"]?\s+tool\b/gi,
    message: "Document instructs the agent to call a tool.",
  },
  {
    code: "TOOL_DIRECTIVE",
    pattern: /\buse\s+(?:the\s+)?[`'"]?[a-z][\w.-]*[`'"]?\s+tool\b/gi,
    message: "Document instructs the agent to use a tool.",
  },
  {
    code: "TOOL_DIRECTIVE",
    pattern: /\b(?:tool_call|function_call|tool_use)\b/gi,
    message: "Document contains a tool-call token.",
  },
  {
    code: "UNSAFE_MARKUP",
    pattern: /<\s*(?:script|iframe|object|embed|form)\b[^>]*>/gi,
    message: "Document contains executable markup.",
  },
  {
    code: "UNSAFE_MARKUP",
    pattern: /\bjavascript\s*:/gi,
    message: "Document contains a javascript: URL.",
  },
];

/** Source domains the KB is allowed to cite (§13.3). */
export const SOURCE_DOMAIN_ALLOWLIST: readonly string[] = [
  "carbondesignsystem.com",
  "design-system.service.gov.uk",
  "developer.apple.com",
  "developer.mozilla.org",
  "diataxis.fr",
  "dschool.stanford.edu",
  "github.com",
  "html.spec.whatwg.org",
  "inclusive.microsoft.design",
  "learn.microsoft.com",
  "m2.material.io",
  "m3.material.io",
  "pages.nist.gov",
  "research.google",
  "storybook.js.org",
  "web.dev",
  "www.deceptive.design",
  "www.designcouncil.org.uk",
  "www.ftc.gov",
  "www.gov.uk",
  "www.interaction-design.org",
  "www.iso.org",
  "www.lukew.com",
  "www.nngroup.com",
  "www.radix-ui.com",
  "www.tableau.com",
  "www.w3.org",
  "w3.org",
];

export function isAllowedSourceUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  return SOURCE_DOMAIN_ALLOWLIST.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

const URL_PATTERN = /https?:\/\/[^\s<>()\]]+/g;

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split(/\r?\n/).length;
}

/** Report unsafe instructions and out-of-allow-list URLs. Never returns truth claims. */
export function scanContent(text: string): SanitizerFinding[] {
  const findings: SanitizerFinding[] = [];

  for (const { code, pattern, message } of INSTRUCTION_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      findings.push({
        code,
        message: `${message} (line ${lineOf(text, match.index)})`,
        match: match[0],
        index: match.index,
      });
    }
  }

  const urls = new RegExp(URL_PATTERN.source, URL_PATTERN.flags);
  let urlMatch: RegExpExecArray | null;
  while ((urlMatch = urls.exec(text)) !== null) {
    const raw = urlMatch[0].replace(/[.,;:]+$/, "");
    if (!isAllowedSourceUrl(raw)) {
      findings.push({
        code: "DISALLOWED_URL",
        message: `URL host is not on the source allow-list (line ${lineOf(text, urlMatch.index)})`,
        match: raw,
        index: urlMatch.index,
      });
    }
  }

  return findings.sort((a, b) => a.index - b.index);
}

export function isCleanContent(text: string): boolean {
  return scanContent(text).length === 0;
}

/**
 * Strip unsafe instructions and disallowed absolute URLs.
 *
 * Used when rendering documents so a content edit cannot silently turn into
 * agent instructions. Findings are reported separately for lint/build gates.
 */
export function sanitizeContent(text: string): { clean: string; findings: SanitizerFinding[] } {
  const findings = scanContent(text);
  if (findings.length === 0) return { clean: text, findings };

  let clean = text;
  for (const finding of [...findings].sort((a, b) => b.index - a.index)) {
    const replacement =
      finding.code === "DISALLOWED_URL" ? "[removed: external link]" : "[removed: unsafe instruction]";
    clean = clean.slice(0, finding.index) + replacement + clean.slice(finding.index + finding.match.length);
  }
  return { clean, findings };
}
