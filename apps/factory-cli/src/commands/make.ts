import { runCIPipeline } from "@mcptoolshop/rf-pipeline-ci";
import { runReleasePipeline } from "@mcptoolshop/rf-pipeline-release";
import { RfError } from "@mcptoolshop/rf-core";

export interface MakeOptions {
  from: string;
  run?: string;
  repo?: string;
  tag?: string;
  output?: string;
}

export async function handleMake(kind: string, opts: MakeOptions): Promise<void> {
  if (opts.from !== "github") {
    console.error(`Unknown source: ${opts.from}. Supported: github`);
    process.exit(1);
  }

  try {
    if (kind === "ci") {
      const result = await runCIPipeline(
        "github",
        { runId: opts.run, repo: opts.repo },
        opts.output ?? "receipts",
      );

      console.log(`Receipt created: ${result.receipt.id.slice(0, 12)}...`);
      console.log(`  JSON: ${result.files.json}`);
      console.log(`  MD:   ${result.files.md}`);
      console.log(`  HTML: ${result.files.html}`);
    } else if (kind === "release") {
      const result = await runReleasePipeline(
        "github",
        { repo: opts.repo, tag: opts.tag },
        opts.output ?? "receipts",
      );

      console.log(`Receipt created: ${result.receipt.id.slice(0, 12)}...`);
      console.log(`  JSON: ${result.files.json}`);
      console.log(`  MD:   ${result.files.md}`);
      console.log(`  HTML: ${result.files.html}`);
    } else {
      console.error(`Unknown receipt kind: ${kind}. Supported: ci, release`);
      process.exit(1);
    }
  } catch (err) {
    if (err instanceof RfError) {
      console.error(err.toCliText());
      process.exit(2);
    }
    throw err;
  }
}
