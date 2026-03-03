import { verifyIntegrity } from "@mcptoolshop/rf-core";
import type { VerificationCheck } from "./types.js";

/**
 * Recompute the canonical hash and compare to stored digest.
 */
export function checkHash(receipt: Record<string, unknown>): VerificationCheck {
  const integrity = receipt.integrity as { digest?: string } | undefined;

  if (!integrity?.digest) {
    return {
      name: "hash",
      passed: false,
      message: "No integrity digest found in receipt",
    };
  }

  const valid = verifyIntegrity(receipt);

  if (valid) {
    return {
      name: "hash",
      passed: true,
      message: `Hash verified: ${integrity.digest}`,
    };
  }

  return {
    name: "hash",
    passed: false,
    message: "Hash mismatch — receipt content has been modified since creation",
    details: { stored_digest: integrity.digest },
  };
}
