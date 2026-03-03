import { readFileSync, writeFileSync } from "node:fs";
import { computeDigest } from "@mcptoolshop/rf-core";
import { RfError } from "@mcptoolshop/rf-core";
import { isCosignAvailable, signBlob } from "./cosign.js";
import type { SignOptions, SignResult } from "./types.js";

/**
 * Sign a receipt JSON file.
 *
 * Produces sidecar .sig and .cert files (receipt stays immutable).
 * Optionally embeds signature back into the receipt's integrity block.
 */
export async function signReceipt(
  receiptPath: string,
  opts: SignOptions = {},
): Promise<SignResult> {
  const available = await isCosignAvailable();
  if (!available) {
    throw new RfError({
      code: "RF_COSIGN_MISSING",
      message: "cosign is not installed or not in PATH",
      hint: "Install cosign: https://docs.sigstore.dev/cosign/system_config/installation/",
    });
  }

  const raw = readFileSync(receiptPath, "utf-8");
  const receipt = JSON.parse(raw) as Record<string, unknown>;
  const digest = (receipt.integrity as { digest?: string })?.digest;
  if (!digest) {
    throw new RfError({
      code: "RF_SIGN_NO_DIGEST",
      message: "Receipt has no integrity digest — cannot sign",
      hint: "Build the receipt with ReceiptBuilder first",
    });
  }

  const sigPath = `${receiptPath}.sig`;
  const certPath = `${receiptPath}.cert`;

  const result = await signBlob(receiptPath, {
    keyless: opts.keyless,
    keyPath: opts.keyPath,
    outputSignature: sigPath,
    outputCertificate: opts.keyless ? certPath : undefined,
  });

  const signedAt = new Date().toISOString();

  const signResult: SignResult = {
    digest,
    signature: result.signature || readSafe(sigPath),
    certificate: result.certificate || readSafe(certPath),
    signedAt,
    sidecarPaths: {
      signature: sigPath,
      certificate: opts.keyless ? certPath : undefined,
    },
  };

  // Embed signature into receipt if requested
  if (opts.embed) {
    const integrity = receipt.integrity as Record<string, unknown>;
    integrity.signature = signResult.signature;
    integrity.signed_at = signedAt;
    if (signResult.signedBy) {
      integrity.signed_by = signResult.signedBy;
    }
    writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
  }

  return signResult;
}

function readSafe(path: string): string {
  try {
    return readFileSync(path, "utf-8").trim();
  } catch {
    return "";
  }
}
