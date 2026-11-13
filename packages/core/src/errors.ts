export type KbErrorCode =
  | "DOC_NOT_FOUND"
  | "PACK_NOT_FOUND"
  | "INVALID_STAGE"
  | "INVALID_QUERY"
  | "INVALID_INPUT"
  | "SESSION_NOT_FOUND"
  | "SESSION_FORBIDDEN"
  | "KEY_LIMIT_REACHED"
  | "CONTENT_INVALID";

export class KbError extends Error {
  readonly code: KbErrorCode;

  constructor(code: KbErrorCode, message: string) {
    super(message);
    this.name = "KbError";
    this.code = code;
  }
}
