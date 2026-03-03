import { runCIPipeline } from "@mcptoolshop/rf-pipeline-ci";
import { RfError } from "@mcptoolshop/rf-core";

export interface MakeOptions {
  from: string;
  run?: string;
  repo?: string;
  output?: string;
}

export async function handleMake(kind: string, opts: MakeOptions): Promise<void> {
  if (kind !== "ci") {
    console.error(`Unknown receipt kind: ${kind}. Supported: ci`);
    process.exit(1);
  }

  if (opts.from !== "github") {
    console.error(`Unknown source: ${opts.from}. Supported: github`);
    process.exit(1);
  }

  try {
    const result = await runCIPipeline(
      "github",
      { runId: opts.run, repo: opts.repo },
      opts.output ?? "receipts",
    );

    console.log(`Receipt created: ${result.receipt.id.slice(0, 12)}…`);
    console.log(`  JSON: ${result.files.json}`);
    console.log(`  MD:   ${result.files.md}`);
    console.log(`  HTML: ${result.files.html}`);
  } catch (err) {
    if (err instanceof RfError) {
      console.error(err.toCliText());
      process.exit(2);
    }
    throw err;
  }
}
