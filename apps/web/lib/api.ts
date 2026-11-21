import { NextResponse } from "next/server";
import type { UserRecord } from "@ux-kb/core/store";
import { getSessionUser } from "./authz";
import { can, type Action } from "./policy";
import { isSameOrigin } from "./request";
import { STEP_UP_ACTIONS, verifyStepUp } from "./mfa-guard";

const MAX_BODY_BYTES = 256 * 1024;

export function jsonError(
  status: number,
  message: string,
  code?: string,
  extra?: Record<string, string>,
): NextResponse {
  return NextResponse.json(
    { error: message, ...(code ? { code } : {}) },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(extra ?? {}),
      },
    },
  );
}

export type GuardResult = { user: UserRecord; response?: never } | { user?: never; response: NextResponse };

export interface GuardOptions {
  /** Reject a POST whose Origin header points at another host. */
  mutating?: boolean;
  /** Require a fresh TOTP code when the user has MFA enabled. */
  stepUp?: boolean;
}

/**
 * The single authorization gate for admin API routes. It resolves the session,
 * checks same-origin on mutations, enforces the role matrix, and applies MFA
 * step-up for sensitive actions.
 */
export async function guardApi(
  request: Request,
  action: Action,
  options: GuardOptions = {},
): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) return { response: jsonError(401, "Sign in required.", "unauthorized") };

  if (options.mutating && !isSameOrigin(request)) {
    return { response: jsonError(403, "Cross-origin request blocked.", "csrf") };
  }

  if (!can(user, action)) {
    return { response: jsonError(403, "You do not have permission to perform this action.", "forbidden") };
  }

  const needsStepUp = options.stepUp ?? STEP_UP_ACTIONS.has(action);
  if (needsStepUp) {
    const code = request.headers.get("x-mfa-code") ?? "";
    const result = await verifyStepUp(user, code);
    if (!result.ok) {
      return {
        response: jsonError(403, result.error ?? "MFA code required.", "mfa_required"),
      };
    }
  }

  return { user };
}

/** Parse a JSON body with a hard size cap. Returns a ready-made 400/413 response on failure. */
export async function readJsonBody<T>(
  request: Request,
  maxBytes = MAX_BODY_BYTES,
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { response: jsonError(413, "Request body is too large.", "payload_too_large") };
  }
  let text: string;
  try {
    text = await request.text();
  } catch {
    return { response: jsonError(400, "Could not read the request body.", "bad_request") };
  }
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { response: jsonError(413, "Request body is too large.", "payload_too_large") };
  }
  if (!text.trim()) {
    return { response: jsonError(400, "A JSON body is required.", "bad_request") };
  }
  try {
    return { data: JSON.parse(text) as T };
  } catch {
    return { response: jsonError(400, "Invalid JSON body.", "bad_request") };
  }
}
