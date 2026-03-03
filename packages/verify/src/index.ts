import { checkSchema } from "./schema-check.js";
import { checkHash } from "./hash-check.js";
import { checkLinks } from "./link-check.js";
import { checkLint } from "./lint-check.js";
import { buildResult, formatResult } from "./report.js";
import type { VerificationResult } from "./types.js";

export type { VerificationCheck, VerificationResult } from "./types.js";
export { checkSchema } from "./schema-check.js";
export { checkHash } from "./hash-check.js";
export { checkLinks } from "./link-check.js";
export { checkLint } from "./lint-check.js";
export { buildResult, formatResult } from "./report.js";

export interface VerifyOptions {
  offline?: boolean;
  strict?: boolean;
}

/**
 * Run all verification checks on a receipt.
 * In strict mode, lint checks are included and can fail the receipt.
 */
export async function verifyReceipt(
  receipt: Record<string, unknown>,
  opts: VerifyOptions = {},
): Promise<VerificationResult> {
  const receiptId = (receipt.id as string) ?? "unknown";

  const checks = [
    checkSchema(receipt),
    ...checkHash(receipt),
    await checkLinks(receipt, opts),
  ];

  if (opts.strict) {
    checks.push(...checkLint(receipt));
  }

  return buildResult(receiptId, checks);
}

/**
 * Run all checks and return formatted CLI text.
 */
export async function verifyAndFormat(
  receipt: Record<string, unknown>,
  opts: VerifyOptions = {},
): Promise<string> {
  const result = await verifyReceipt(receipt, opts);
  return formatResult(result);
}
