import type { KbStore, GateRecord, GateItem, GateResult, CreateGateInput } from "../store/types";
import type { ContentRepository } from "../content/repository";
import type { SessionRecord } from "../store/types";
import { requireSession } from "./session.service";
import { KbError } from "../errors";
import { getChecklist } from "./docs.service";

const GATE_VERSION = 1;

const COMPONENT_DOC_MAP: Record<string, string> = {
  button: "CMP-001",
  input: "CMP-002",
  dropdown: "CMP-003",
  card: "CMP-004",
  modal: "CMP-005",
  navigation: "CMP-006",
  tabs: "CMP-007",
  tooltip: "CMP-008",
  table: "CMP-009",
  notification: "CMP-010",
};

const CORE_GATE: GateItem[] = [
  {
    id: "SCR.loading",
    scope: "screen",
    check: "Loading state shown within 100 ms, layout stable, control disabled or relabelled?",
    severity: "blocker",
    naForbidden: false,
    verify: {
      type: "test",
      hint: "Throttle network; assert skeleton/spinner and disabled trigger.",
      snippet: { framework: "playwright", code: "await page.route('**/*', r => r.delay(500));\nawait page.click('button');\nawait expect(page.locator('[data-loading]')).toBeVisible();" },
      snippets: [
        { framework: "playwright", code: "await page.route('**/*', r => r.delay(500));\nawait page.click('button');\nawait expect(page.locator('[data-loading]')).toBeVisible();" },
        { framework: "cypress", code: "cy.intercept('**/*', (req) => { req.on('response', (res) => res.setDelay(500)); });\ncy.get('button').click();\ncy.get('[data-loading]').should('be.visible');" },
      ],
    },
  },
  {
    id: "SCR.empty",
    scope: "screen",
    check: "Empty states distinguish first use / no matches / no permission / unavailable, each with the right action?",
    severity: "blocker",
    naForbidden: false,
    verify: {
      type: "test",
      hint: "Render each empty variant; assert correct copy and action.",
      snippets: [
        { framework: "playwright", code: "await expect(page.getByText(/no results/i)).toBeVisible();\nawait expect(page.getByRole('button', { name: /clear/i })).toBeVisible();" },
        { framework: "cypress", code: "cy.contains(/no results/i).should('be.visible');\ncy.findByRole('button', { name: /clear/i }).should('be.visible');" },
      ],
    },
  },
  {
    id: "SCR.error",
    scope: "screen",
    check: "Errors specific, input preserved, announced, recovery offered?",
    severity: "blocker",
    naForbidden: true,
    verify: {
      type: "test",
      hint: "Trigger failure; assert specific message, preserved input, announced error, retry.",
      snippets: [
        { framework: "playwright", code: "await page.route('**/api/**', r => r.fulfill({ status: 500 }));\nawait page.getByLabel('Email').fill('a@b.co');\nawait page.getByRole('button', { name: /save/i }).click();\nawait expect(page.getByRole('alert')).toBeVisible();\nawait expect(page.getByLabel('Email')).toHaveValue('a@b.co');" },
        { framework: "cypress", code: "cy.intercept('POST', '**/api/**', { statusCode: 500 });\ncy.findByLabelText('Email').type('a@b.co');\ncy.findByRole('button', { name: /save/i }).click();\ncy.findByRole('alert').should('be.visible');\ncy.findByLabelText('Email').should('have.value', 'a@b.co');" },
      ],
    },
  },
  {
    id: "SCR.keyboard",
    scope: "screen",
    check: "Every action reachable and operable by keyboard; focus visible and logical?",
    severity: "blocker",
    naForbidden: true,
    verify: {
      type: "test",
      hint: "Tab through; assert focus visible and logical; Enter/Space activates.",
      snippet: { framework: "playwright", code: "await page.keyboard.press('Tab');\nawait expect(page.getByRole('button')).toBeFocused();" },
      snippets: [
        { framework: "playwright", code: "await page.keyboard.press('Tab');\nawait expect(page.getByRole('button')).toBeFocused();\nawait page.keyboard.press('Enter');\nawait expect(page.getByRole('dialog')).toBeVisible();" },
        { framework: "cypress", code: "cy.get('body').tab();\ncy.focused().should('have.attr', 'role', 'button');\ncy.focused().type('{enter}');\ncy.get('[role=dialog]').should('be.visible');" },
      ],
    },
  },
  {
    id: "SCR.action-feedback",
    scope: "screen",
    check: "After each click/submit, the user sees that it registered (state change, toast, or navigation) and duplicates are prevented?",
    severity: "blocker",
    naForbidden: true,
    verify: {
      type: "test",
      hint: "Click submit; assert pending state and no duplicate requests.",
      snippet: { framework: "playwright", code: "await page.click('button[type=submit]');\nawait expect(page.locator('[aria-busy=true]')).toBeVisible();" },
      snippets: [
        { framework: "playwright", code: "let calls = 0;\npage.on('request', r => { if (r.url().includes('/api/save')) calls++; });\nawait page.click('button[type=submit]');\nawait expect(page.locator('[aria-busy=true]')).toBeVisible();\nexpect(calls).toBe(1);" },
        { framework: "cypress", code: "cy.intercept('POST', '**/api/save').as('save');\ncy.get('button[type=submit]').click();\ncy.get('[aria-busy=true]').should('be.visible');\ncy.wait('@save');" },
      ],
    },
  },
  {
    id: "SCR.responsive",
    scope: "screen",
    check: "Works at 320 px and 200% zoom without loss of content or function?",
    severity: "major",
    naForbidden: false,
    verify: {
      type: "test",
      hint: "Check 320px and 200% zoom; assert no clipped content.",
      snippets: [
        { framework: "playwright", code: "await page.setViewportSize({ width: 320, height: 800 });\nawait expect(page.getByRole('main')).toBeVisible();" },
        { framework: "cypress", code: "cy.viewport(320, 800);\ncy.get('main').should('be.visible');" },
      ],
    },
  },
  {
    id: "SCR.names",
    scope: "screen",
    check: "Controls have accessible names; headings/landmarks semantic?",
    severity: "major",
    naForbidden: true,
    verify: {
      type: "test",
      hint: "Run axe; assert accessible names and landmarks.",
      tools: ["axe: focus-order-semantics"],
      snippets: [
        { framework: "playwright", code: "const results = await new AxeBuilder({ page }).analyze();\nexpect(results.violations).toEqual([]);" },
        { framework: "cypress", code: "cy.checkA11y();" },
      ],
    },
  },
  {
    id: "SCR.success",
    scope: "screen",
    check: "Success state confirms what happened and what changed?",
    severity: "major",
    naForbidden: false,
    verify: {
      type: "test",
      hint: "Complete action; assert success message and state change.",
      snippets: [
        { framework: "playwright", code: "await page.getByRole('button', { name: /save/i }).click();\nawait expect(page.getByRole('status')).toContainText(/saved/i);" },
        { framework: "cypress", code: "cy.findByRole('button', { name: /save/i }).click();\ncy.findByRole('status').should('contain.text', 'Saved');" },
      ],
    },
  },
  {
    id: "SCR.permission",
    scope: "screen",
    check: "Behavior defined when the user lacks access?",
    severity: "minor",
    naForbidden: false,
    verify: {
      type: "test",
      hint: "Render as unauthorized; assert defined behavior.",
      snippets: [
        { framework: "playwright", code: "await page.getByRole('button', { name: /delete/i }).click();\nawait expect(page.getByRole('alert')).toContainText(/permission/i);" },
        { framework: "cypress", code: "cy.findByRole('button', { name: /delete/i }).click();\ncy.findByRole('alert').should('contain.text', 'permission');" },
      ],
    },
  },
];

export function coreScreenGateItems(): GateItem[] {
  return CORE_GATE.map((i) => ({ ...i, verify: i.verify ? { ...i.verify } : undefined }));
}

const SCREEN_TYPE_EXTRAS: Record<string, GateItem[]> = {
  list: [
    { id: "SCR.list.pagination", scope: "screen", check: "Pagination state preserved and announced?", severity: "major", naForbidden: false, verify: { type: "test", hint: "Navigate pages; assert URL/state and announcement." } },
    { id: "SCR.list.sort-filter-state", scope: "screen", check: "Sort/filter state reflected in URL and UI?", severity: "major", naForbidden: false, verify: { type: "test", hint: "Apply sort/filter; assert URL params and UI." } },
  ],
  form: [
    { id: "SCR.form.preserve-input", scope: "screen", check: "Input preserved on validation error?", severity: "major", naForbidden: false, verify: { type: "test", hint: "Submit invalid; assert inputs retained." } },
    { id: "SCR.form.required-optional", scope: "screen", check: "Required vs optional fields clearly marked?", severity: "minor", naForbidden: false, verify: { type: "test", hint: "Inspect labels; assert required indicators." } },
  ],
  dashboard: [
    { id: "SCR.dash.freshness", scope: "screen", check: "Data freshness indicated?", severity: "major", naForbidden: false, verify: { type: "test", hint: "Check timestamp/refresh; assert visible." } },
    { id: "SCR.dash.metric-definition", scope: "screen", check: "Metric definitions available?", severity: "minor", naForbidden: false, verify: { type: "test", hint: "Hover/click metric; assert definition." } },
  ],
};

/** IDs of blocker/major items that lack a verify hint (should be empty). */
export function gateVerifyCoverage(items: GateItem[]): string[] {
  return items
    .filter((i) => (i.severity === "blocker" || i.severity === "major") && !i.verify?.hint)
    .map((i) => i.id);
}

export function screenTypeExtraItems(screenType: string): GateItem[] {
  return (SCREEN_TYPE_EXTRAS[screenType] ?? []).map((i) => ({ ...i, verify: i.verify ? { ...i.verify } : undefined }));
}

export interface StartGateInput {
  sessionId: string;
  screen: string;
  components: string[];
  screenType: string;
  extraStates?: string[];
}

export async function startGate(
  store: KbStore,
  repo: ContentRepository,
  session: SessionRecord,
  input: StartGateInput,
): Promise<{ gateId: string; gateVersion: number; items: GateItem[]; counts: { total: number; blocker: number; major: number; minor: number } }> {
  const screen = input.screen.trim();
  if (!screen) throw new KbError("INVALID_INPUT", "screen is required.");

  const components = input.components ?? [];
  const screenType = input.screenType ?? "other";
  const extraStates = input.extraStates ?? [];

  const items: GateItem[] = [...CORE_GATE.map((i) => ({ ...i }))];

  // screen-type extras
  const extras = SCREEN_TYPE_EXTRAS[screenType];
  if (extras) items.push(...extras.map((i) => ({ ...i })));

  // component checklists
  for (const comp of components) {
    const docId = COMPONENT_DOC_MAP[comp.toLowerCase()];
    if (!docId) continue;
    let docChecks: { docId: string; text: string }[] = [];
    try {
      docChecks = getChecklist(repo, [docId]);
    } catch {
      docChecks = [];
    }
    docChecks.forEach((c, index) => {
      items.push({
        id: `${docId}.c${index + 1}`,
        scope: "component",
        component: comp,
        check: c.text,
        severity: "major",
        naForbidden: false,
        verify: { type: "test", hint: `Verify this check for the ${comp} component.` },
      });
    });
  }

  const gate = await store.createGate({
    sessionId: session.id,
    screen,
    components,
    screenType,
    extraStates,
    items,
  });

  const counts = { total: items.length, blocker: 0, major: 0, minor: 0 };
  for (const item of items) {
    if (item.severity === "blocker") counts.blocker++;
    else if (item.severity === "major") counts.major++;
    else counts.minor++;
  }

  return { gateId: gate.id, gateVersion: gate.gateVersion, items, counts };
}

// ---------- report_check ----------

export interface ReportCheckEntry {
  itemId: string;
  result: "pass" | "fail" | "na" | "waive";
  evidence?: { type: string; ref: string }[];
  note?: string;
  naReason?: string;
  waiver?: { by: "user"; reason: string; ticket?: string };
}

export interface ReportCheckResult {
  accepted: string[];
  rejected: { itemId: string; reason: string }[];
  weak: string[];
  remaining: number;
}

function validateEvidenceRef(type: string, ref: string): string | null {
  if (type === "file") {
    if (!/^[^\s:]+(:\d+(-\d+)?)?$/.test(ref)) return "BAD_FILE_REF";
  } else if (type === "test") {
    if (!ref.includes("::")) return "BAD_TEST_REF";
  } else if (type === "manual") {
    if (ref.length < 20) return "MANUAL_TOO_SHORT";
  } else if (type === "url") {
    if (!/^https?:\/\//.test(ref)) return "BAD_URL_REF";
  }
  if (ref.length > 500) return "REF_TOO_LONG";
  return null;
}

export async function reportCheck(
  store: KbStore,
  gateId: string,
  sessionId: string,
  results: ReportCheckEntry[],
): Promise<ReportCheckResult> {
  const gate = await store.getGate(gateId);
  if (!gate || gate.sessionId !== sessionId) {
    throw new KbError("GATE_NOT_FOUND", `Unknown gate "${gateId}".`);
  }

  const accepted: string[] = [];
  const rejected: { itemId: string; reason: string }[] = [];
  const weak: string[] = [];

  for (const r of results) {
    const item = gate.items.find((i) => i.id === r.itemId);
    if (!item) {
      rejected.push({ itemId: r.itemId, reason: "UNKNOWN_ITEM" });
      continue;
    }

    // validation
    let reason: string | null = null;
    if (r.result === "pass") {
      if (!r.evidence || r.evidence.length === 0) reason = "EVIDENCE_REQUIRED";
    } else if (r.result === "fail") {
      if (!r.note) reason = "NOTE_REQUIRED";
    } else if (r.result === "na") {
      if (item.naForbidden) reason = "NA_FORBIDDEN";
      else if (!r.naReason || r.naReason.length < 15) reason = "NA_REASON_REQUIRED";
    } else if (r.result === "waive") {
      if (item.severity === "blocker") reason = "WAIVER_FORBIDDEN";
      if (!r.waiver) reason = reason ?? "WAIVER_REQUIRED";
      else if (r.waiver.reason.length < 15) reason = reason ?? "WAIVER_REASON_REQUIRED";
      else if (r.waiver.by !== "user") reason = reason ?? "WAIVER_FORBIDDEN";
    }

    // evidence ref format
    if (!reason && r.evidence) {
      for (const e of r.evidence) {
        const err = validateEvidenceRef(e.type, e.ref);
        if (err) { reason = err; break; }
      }
    }

    if (reason) {
      rejected.push({ itemId: r.itemId, reason });
      continue;
    }

    const isWeak = (r.evidence?.length ?? 0) > 0 && r.evidence!.every((e) => e.type === "manual");

    const gateResult: GateResult = {
      itemId: r.itemId,
      result: r.result,
      evidence: r.evidence,
      note: r.note,
      naReason: r.naReason,
      waiver: r.waiver,
      weak: isWeak,
      at: new Date().toISOString(),
    };

    gate.results[r.itemId] = gateResult;
    accepted.push(r.itemId);
    if (isWeak) weak.push(r.itemId);
  }

  await store.saveGate(gate);

  const status = computeGateStatus(gate);
  return { accepted, rejected, weak, remaining: status.counts.open };
}

// ---------- gate_status ----------

export interface GateStatusResult {
  done: boolean;
  counts: { pass: number; fail: number; na: number; waive: number; open: number; weak: number };
  blockersOpen: string[];
  failed: string[];
  naWithoutStrongReason: string[];
  openItems?: { id: string; check: string; severity: string }[];
  items?: GateItem[];
  results?: Record<string, GateResult>;
}

export function computeGateStatus(gate: GateRecord, view: "summary" | "open" | "full" = "summary"): GateStatusResult {
  const counts = { pass: 0, fail: 0, na: 0, waive: 0, open: 0, weak: 0 };
  const blockersOpen: string[] = [];
  const failed: string[] = [];
  const naWithoutStrongReason: string[] = [];

  for (const item of gate.items) {
    const r = gate.results[item.id];
    if (!r) {
      counts.open++;
      if (item.severity === "blocker" || item.severity === "major") {
        // major open handled separately; blockers open list only blockers
      }
      if (item.severity === "blocker") blockersOpen.push(item.id);
      continue;
    }
    counts[r.result as "pass" | "fail" | "na" | "waive"]++;
    if (r.weak) counts.weak++;
    if (r.result === "fail") {
      failed.push(item.id);
      if (item.severity === "blocker") blockersOpen.push(item.id);
    }
    if (r.result === "waive" && item.severity === "blocker") blockersOpen.push(item.id);
    if (r.result === "na") {
      if (item.naForbidden || !r.naReason || r.naReason.length < 15) {
        naWithoutStrongReason.push(item.id);
      }
    }
  }

  const majorOpen = gate.items.some((i) => i.severity === "major" && !gate.results[i.id]);
  const allNaValid = naWithoutStrongReason.length === 0;
  const done = blockersOpen.length === 0 && !majorOpen && failed.length === 0 && allNaValid;

  const result: GateStatusResult = {
    done,
    counts,
    blockersOpen,
    failed,
    naWithoutStrongReason,
  };

  if (view === "open" || view === "full") {
    result.openItems = gate.items
      .filter((i) => !gate.results[i.id])
      .map((i) => ({ id: i.id, check: i.check, severity: i.severity }));
  }
  if (view === "full") {
    result.items = gate.items;
    result.results = gate.results;
  }

  return result;
}

export async function gateStatus(
  store: KbStore,
  gateId: string,
  sessionId: string,
  view: "summary" | "open" | "full" = "summary",
): Promise<GateStatusResult> {
  const gate = await store.getGate(gateId);
  if (!gate || gate.sessionId !== sessionId) {
    throw new KbError("GATE_NOT_FOUND", `Unknown gate "${gateId}".`);
  }
  return computeGateStatus(gate, view);
}
