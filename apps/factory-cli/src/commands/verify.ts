import { readFileSync } from "node:fs";
import { verifyReceipt, formatResult } from "@mcptoolshop/rf-verify";

export interface VerifyOptions {
  offline: boolean;
}

export async function handleVerify(file: string, opts: VerifyOptions): Promise<void> {
  try {
    const raw = readFileSync(file, "utf-8");
    const receipt = JSON.parse(raw) as Record<string, unknown>;

    const result = await verifyReceipt(receipt, { offline: opts.offline });
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
