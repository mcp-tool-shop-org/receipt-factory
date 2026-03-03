import { checkSchema } from "./schema-check.js";
import { checkHash } from "./hash-check.js";
import { checkLinks } from "./link-check.js";
import { buildResult, formatResult } from "./report.js";
import type { VerificationResult } from "./types.js";

export type { VerificationCheck, VerificationResult } from "./types.js";
export { checkSchema } from "./schema-check.js";
export { checkHash } from "./hash-check.js";
export { checkLinks } from "./link-check.js";
export { buildResult, formatResult } from "./report.js";

/**
 * Run all verification checks on a receipt.
 */
export async function verifyReceipt(
  receipt: Record<string, unknown>,
  opts: { offline?: boolean } = {},
): Promise<VerificationResult> {
  const receiptId = (receipt.id as string) ?? "unknown";

  const checks = [
    checkSchema(receipt),
    checkHash(receipt),
    await checkLinks(receipt, opts),
  ];

  return buildResult(receiptId, checks);
}

/**
 * Run all checks and return formatted CLI text.
 */
export async function verifyAndFormat(
  receipt: Record<string, unknown>,
  opts: { offline?: boolean } = {},
): Promise<string> {
  const result = await verifyReceipt(receipt, opts);
  return formatResult(result);
}
