import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, "..", "..", "dist", "cli.js");

function run(...args: string[]): string {
  return execFileSync("node", [cliPath, ...args], {
    encoding: "utf-8",
    timeout: 10_000,
  });
}

describe("rf CLI", () => {
  it("shows version", () => {
    const output = run("--version");
    expect(output.trim()).toBe("1.0.0");
  });

  it("shows help", () => {
    const output = run("--help");
    expect(output).toContain("receipt-factory");
    expect(output).toContain("make");
    expect(output).toContain("render");
    expect(output).toContain("verify");
    expect(output).toContain("init");
  });

  it("make --help shows options", () => {
    const output = run("make", "--help");
    expect(output).toContain("--from");
    expect(output).toContain("--run");
    expect(output).toContain("--repo");
  });

  it("verify --help shows options", () => {
    const output = run("verify", "--help");
    expect(output).toContain("--offline");
  });

  it("render --help shows formats", () => {
    const output = run("render", "--help");
    expect(output).toContain("--format");
  });
});
