import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { verifyReceipt, formatResult } from "@mcptoolshop/rf-verify";
import { loadPolicy } from "@mcptoolshop/rf-policy";

export interface VerifyOptions {
  offline: boolean;
  strict: boolean;
  follow?: boolean;
  policy?: string;
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

    // Default receiptsDir to the parent of the receipt file
    const receiptsDir = opts.receiptsDir ?? dirname(file);

    const result = await verifyReceipt(receipt, {
      offline: opts.offline,
      strict: opts.strict,
      follow: opts.follow,
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
