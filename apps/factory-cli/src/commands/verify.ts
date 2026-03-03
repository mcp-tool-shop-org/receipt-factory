import { existsSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { verifyReceipt, formatResult } from "@mcptoolshop/rf-verify";
import { loadPolicy } from "@mcptoolshop/rf-policy";
import { verifyBlob } from "@mcptoolshop/rf-sign";

export interface VerifyOptions {
  offline: boolean;
  strict: boolean;
  follow?: boolean;
  refsStrict?: boolean;
  policy?: string;
  requirePolicySignature?: boolean;
  receiptsDir?: string;
}

export async function handleVerify(file: string, opts: VerifyOptions): Promise<void> {
  try {
    const raw = readFileSync(file, "utf-8");
    const receipt = JSON.parse(raw) as Record<string, unknown>;

    // Load policy rules if a policy file is specified
    const policyRules = opts.policy
      ? loadPolicy(opts.policy).rules
      : undefined;

    // Verify policy signature if required
    if (opts.requirePolicySignature) {
      if (!opts.policy) {
        console.error("[RF_VERIFY] --require-policy-signature requires --policy <path>");
        process.exit(1);
        return;
      }

      const sigPath = `${opts.policy}.sig`;
      if (!existsSync(sigPath)) {
        console.error(`[RF_VERIFY] Policy signature not found: ${sigPath}`);
        console.error("  Sign the policy with: rf policy sign policy.json --keyless");
        process.exit(3);
        return;
      }

      const sigValid = await verifyBlob(opts.policy, { signaturePath: sigPath });
      if (!sigValid) {
        console.error("[RF_VERIFY] Policy signature verification failed");
        process.exit(3);
        return;
      }

      console.log("✓ Policy signature verified");
    }

    // Default receiptsDir to the parent of the receipt file
    const receiptsDir = opts.receiptsDir ?? dirname(file);

    const result = await verifyReceipt(receipt, {
      offline: opts.offline,
      strict: opts.strict,
      follow: opts.follow,
      refsStrict: opts.refsStrict,
      policy: policyRules,
      receiptsDir,
    });
    console.log(formatResult(result));

    if (!result.valid) {
      process.exit(3);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`[RF_PARSE] Failed to parse ${file}: ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}
