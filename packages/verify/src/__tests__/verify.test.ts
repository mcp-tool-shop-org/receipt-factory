import { describe, it, expect } from "vitest";
import { ReceiptBuilder } from "@mcptoolshop/rf-core";
import { checkSchema } from "../schema-check.js";
import { checkHash } from "../hash-check.js";
import { checkLinks } from "../link-check.js";
import { verifyReceipt } from "../index.js";

function makeReceipt() {
  return new ReceiptBuilder("ci_run")
    .subject({ type: "repository", name: "test-repo", ref: "abc123" })
    .intent("Run CI tests")
    .createdAt("2026-03-03T12:00:00.000Z")
    .addOutput({ name: "results.xml", digest: "sha256:abc" })
    .addEvidence({
      type: "workflow_run",
      url: "https://github.com/org/repo/actions/runs/123",
      description: "CI run",
    })
    .addStep("Run rf verify")
    .addCommand("rf verify receipt.json")
    .environment({ runner: "ubuntu-latest", tool_versions: { node: "20.11.0" } })
    .build();
}

describe("checkSchema", () => {
  it("passes for a valid receipt", () => {
    const result = checkSchema(makeReceipt());
    expect(result.passed).toBe(true);
    expect(result.name).toBe("schema");
  });

  it("fails for an invalid receipt", () => {
    const result = checkSchema({ garbage: true });
    expect(result.passed).toBe(false);
    expect(result.message).toContain("Schema validation failed");
  });
});

describe("checkHash", () => {
  it("passes for an untampered receipt", () => {
    const receipt = makeReceipt();
    const result = checkHash(receipt as unknown as Record<string, unknown>);
    expect(result.passed).toBe(true);
  });

  it("fails for a tampered receipt", () => {
    const receipt = makeReceipt();
    const tampered = { ...receipt, intent: "tampered!" } as unknown as Record<string, unknown>;
    const result = checkHash(tampered);
    expect(result.passed).toBe(false);
    expect(result.message).toContain("mismatch");
  });

  it("fails when integrity is missing", () => {
    const result = checkHash({ kind: "ci_run" });
    expect(result.passed).toBe(false);
    expect(result.message).toContain("No integrity digest");
  });
});

describe("checkLinks", () => {
  it("skips in offline mode", async () => {
    const receipt = makeReceipt() as unknown as Record<string, unknown>;
    const result = await checkLinks(receipt, { offline: true });
    expect(result.passed).toBe(true);
    expect(result.message).toContain("skipped");
  });

  it("passes when no links exist", async () => {
    const receipt = new ReceiptBuilder("ci_run")
      .subject({ type: "repo", name: "test" })
      .intent("test")
      .createdAt("2026-03-03T12:00:00.000Z")
      .build() as unknown as Record<string, unknown>;

    const result = await checkLinks(receipt, { offline: true });
    expect(result.passed).toBe(true);
  });
});

describe("verifyReceipt", () => {
  it("all checks pass for a valid receipt (offline)", async () => {
    const receipt = makeReceipt() as unknown as Record<string, unknown>;
    const result = await verifyReceipt(receipt, { offline: true });

    expect(result.valid).toBe(true);
    expect(result.checks).toHaveLength(3);
    expect(result.checks.every((c) => c.passed)).toBe(true);
  });

  it("fails when receipt is tampered (offline)", async () => {
    const receipt = makeReceipt();
    const tampered = { ...receipt, intent: "hacked" } as unknown as Record<string, unknown>;
    const result = await verifyReceipt(tampered, { offline: true });

    expect(result.valid).toBe(false);
    const hashCheck = result.checks.find((c) => c.name === "hash");
    expect(hashCheck?.passed).toBe(false);
  });
});
