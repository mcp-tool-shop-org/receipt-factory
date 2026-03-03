#!/usr/bin/env node

import { Command } from "commander";
import { VERSION } from "./version.js";
import { handleMake } from "./commands/make.js";
import { handleRender } from "./commands/render.js";
import { handleVerify } from "./commands/verify.js";
import { handleSign } from "./commands/sign.js";
import { handleInit } from "./commands/init.js";

const program = new Command();

program
  .name("rf")
  .description("receipt-factory — create, render, verify, and sign receipts")
  .version(VERSION);

program
  .command("make <kind>")
  .description("Create a receipt (kinds: ci, release)")
  .requiredOption("--from <source>", "Data source (supported: github)")
  .option("--run <id>", "Run ID (defaults to GITHUB_RUN_ID in CI)")
  .option("--repo <owner/name>", "Repository (defaults to GITHUB_REPOSITORY)")
  .option("--tag <tag>", "Release tag (for release kind)")
  .option("--output <dir>", "Output directory (default: receipts)")
  .action(handleMake);

program
  .command("render <file>")
  .description("Render a receipt to markdown or HTML")
  .option("--format <fmt>", "Output format: md, html", "md")
  .option("--output <path>", "Output file path")
  .action(handleRender);

program
  .command("verify <file>")
  .description("Verify receipt integrity")
  .option("--offline", "Skip link reachability checks", false)
  .option("--strict", "Enable lint checks for receipt quality", false)
  .action(handleVerify);

program
  .command("lint <file>")
  .description("Verify receipt with strict lint checks (alias for verify --strict)")
  .option("--offline", "Skip link reachability checks", false)
  .action((file: string, opts: { offline: boolean }) =>
    handleVerify(file, { ...opts, strict: true }),
  );

program
  .command("sign <file>")
  .description("Sign a receipt with cosign")
  .option("--keyless", "Use keyless signing (OIDC, for CI)", false)
  .option("--key <path>", "Path to cosign private key")
  .option("--embed", "Embed signature into receipt integrity block", false)
  .action(handleSign);

program
  .command("init")
  .description("Create receipts/ directory")
  .action(handleInit);

program.parse();
