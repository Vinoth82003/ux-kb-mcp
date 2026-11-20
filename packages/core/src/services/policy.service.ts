import { STAGES, type Stage } from "../schemas/doc";
import { KbError } from "../errors";
import type { SessionMode, SessionRecord } from "../store/types";

export const MODE_BUDGETS: Record<SessionMode, number> = {
  quick: 3000,
  audit: 8000,
  full: 30000,
};

export type StagePackAccess = "disabled" | { stages: readonly Stage[] } | "all";

export interface ModePolicy {
  mode: SessionMode;
  budget: number;
  stagePack: StagePackAccess;
  /** Approval gate before code is a policy flag, on only in full mode. */
  approvalRequiredBeforeCode: boolean;
  critique: "none" | "optional" | "required";
  nextSteps: string[];
}

const MODE_POLICY: Record<SessionMode, Omit<ModePolicy, "budget">> = {
  quick: {
    mode: "quick",
    stagePack: "disabled",
    approvalRequiredBeforeCode: false,
    critique: "none",
    nextSteps: ["start_gate", "get_checklist"],
  },
  audit: {
    mode: "audit",
    stagePack: { stages: ["audit", "critique"] },
    approvalRequiredBeforeCode: false,
    critique: "optional",
    nextSteps: ["start_gate", "get_stage_pack"],
  },
  full: {
    mode: "full",
    stagePack: "all",
    approvalRequiredBeforeCode: true,
    critique: "required",
    nextSteps: ["start_gate", "get_stage_pack", "get_checklist"],
  },
};

export function getModePolicy(mode: SessionMode, tokenBudget?: number): ModePolicy {
  return {
    ...MODE_POLICY[mode],
    budget: tokenBudget ?? MODE_BUDGETS[mode],
  };
}

/** v1 clients (no mode) keep the full workflow. */
export function sessionMode(session: Pick<SessionRecord, "mode">): SessionMode {
  return session.mode ?? "full";
}

export function sessionPolicy(
  session: Pick<SessionRecord, "mode" | "tokenBudget">,
  kbVersion: string,
): PolicyEnvelope {
  const mode = sessionMode(session);
  const policy = getModePolicy(mode, session.tokenBudget);
  return {
    source: "ux-kb-server",
    version: kbVersion,
    advisory: true,
    mode,
    approvalRequiredBeforeCode: policy.approvalRequiredBeforeCode,
    critique: policy.critique,
    stagePacks: {
      enabled: policy.stagePack !== "disabled",
      allowedStages:
        policy.stagePack === "all"
          ? [...STAGES]
          : policy.stagePack === "disabled"
            ? []
            : [...policy.stagePack.stages],
    },
    tokenBudget: policy.budget,
  };
}

export interface PolicyEnvelope {
  /** Server policy, not document content. Clients may override with user instructions. */
  source: "ux-kb-server";
  version: string;
  advisory: true;
  mode: SessionMode;
  approvalRequiredBeforeCode: boolean;
  critique: "none" | "optional" | "required";
  stagePacks: { enabled: boolean; allowedStages: Stage[] };
  tokenBudget: number;
  deprecations?: { tool: string; replacedBy: string; note: string }[];
}

export function assertStagePackAllowed(mode: SessionMode, stage: string): void {
  const access = MODE_POLICY[mode].stagePack;
  if (access === "all") return;
  if (access === "disabled") {
    throw new KbError(
      "INVALID_STAGE",
      "get_stage_pack is disabled in quick mode. Use get_checklist and start_gate instead.",
    );
  }
  if (!access.stages.includes(stage as Stage)) {
    throw new KbError(
      "INVALID_STAGE",
      `Stage "${stage}" is not available in ${mode} mode. Allowed stages: ${access.stages.join(", ")}.`,
    );
  }
}

export const VERIFY_CITATIONS_DEPRECATION = {
  tool: "verify_citations",
  replacedBy: "gate_status",
  note: "verify_citations is an alias retained until v3; use gate_status plus the gate tools.",
} as const;
