import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { runCIPipeline, assemble as assembleCi } from "@mcptoolshop/rf-pipeline-ci";
import { runReleasePipeline, assemble as assembleRelease } from "@mcptoolshop/rf-pipeline-release";
import { RfError, canonicalize } from "@mcptoolshop/rf-core";
import { renderMarkdown, renderHtml } from "@mcptoolshop/rf-render";
import { readEvidencePack } from "@mcptoolshop/rf-evidence";
import type { GitHubCIEvidence } from "@mcptoolshop/rf-adapter-github";
import type { GitHubReleaseEvidence } from "@mcptoolshop/rf-adapter-github";

export interface MakeOptions {
  from: string;
  run?: string;
  repo?: string;
  tag?: string;
  pack?: string;
  output?: string;
}

export async function handleMake(kind: string, opts: MakeOptions): Promise<void> {
  if (opts.from !== "github" && opts.from !== "evidence") {
    console.error(`Unknown source: ${opts.from}. Supported: github, evidence`);
    process.exit(1);
  }

  try {
    if (opts.from === "evidence") {
      await handleMakeFromEvidence(kind, opts);
    } else if (kind === "ci") {
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

async function handleMakeFromEvidence(kind: string, opts: MakeOptions): Promise<void> {
  if (!opts.pack) {
    console.error("--pack <dir> is required when using --from evidence");
    process.exit(1);
  }

  const { manifest, data } = readEvidencePack(opts.pack);

  // Verify kind matches
  const expectedKind = kind === "ci" ? "ci_run" : kind;
  if (manifest.kind !== expectedKind) {
    console.error(
      `Evidence pack kind "${manifest.kind}" does not match requested kind "${kind}"`,
    );
    process.exit(1);
  }

  let receipt;
  if (kind === "ci") {
    receipt = assembleCi(data as GitHubCIEvidence);
  } else if (kind === "release") {
    receipt = assembleRelease(data as GitHubReleaseEvidence);
  } else {
    console.error(`Unknown receipt kind: ${kind}. Supported: ci, release`);
    process.exit(1);
    return;
  }

  // Render
  const md = renderMarkdown(receipt);
  const html = renderHtml(receipt);
  const json = JSON.stringify(JSON.parse(canonicalize(receipt)), null, 2);

  // Write files
  const outputDir = opts.output ?? "receipts";
  const date = receipt.created_at.split("T")[0];
  const slug = kind === "ci"
    ? String((data as GitHubCIEvidence).run.id)
    : (data as GitHubReleaseEvidence).release.tag_name;
  const dir = join(outputDir, kind, date);
  mkdirSync(dir, { recursive: true });

  const basePath = join(dir, slug);
  const jsonPath = `${basePath}.json`;
  const mdPath = `${basePath}.md`;
  const htmlPath = `${basePath}.html`;

  writeFileSync(jsonPath, json, "utf-8");
  writeFileSync(mdPath, md, "utf-8");
  writeFileSync(htmlPath, html, "utf-8");

  console.log(`Receipt created from evidence pack: ${receipt.id.slice(0, 12)}...`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  MD:   ${mdPath}`);
  console.log(`  HTML: ${htmlPath}`);
}
