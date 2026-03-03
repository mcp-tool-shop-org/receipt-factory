<p align="center">
  <strong>receipt-factory</strong>
</p>

<p align="center">
  Receipts are how we prove work happened — without trusting vibes.
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/receipt-factory/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/receipt-factory/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/mcp-tool-shop-org/receipt-factory/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</p>

---

A receipt is a signed, timestamped, reproducible record of **what happened**:

- **What was done** — actions, inputs, outputs
- **Why it was done** — intent, policy, context
- **Who/what did it** — actor, runner, tool versions
- **Proof it happened** — hashes, links, checksums, logs
- **How to verify it** — commands, re-run instructions

You can read a receipt in 30 seconds and verify it in 2 minutes. Everything is reproducible. If it isn't, it's not a receipt.

## Packages

| Package | Description |
|---------|-------------|
| [`@mcptoolshop/rf-core`](packages/core) | Receipt schema, canonicalization, hashing |
| [`@mcptoolshop/rf-render`](packages/render) | Markdown + HTML renderers |
| [`@mcptoolshop/rf-verify`](packages/verify) | Schema validation, hash checking, link verification |
| [`@mcptoolshop/rf-adapter-github`](packages/adapters/github) | GitHub Actions data fetching via `gh` CLI |
| [`@mcptoolshop/rf-cli`](apps/factory-cli) | The `rf` command — create, render, verify receipts |

## Quick start

```bash
# Install the CLI
npm install -g @mcptoolshop/rf-cli

# Create a receipt from a GitHub Actions run
rf make ci --from github --run 12345678

# Render it
rf render receipts/ci/2026-03-03/12345678.json --format html

# Verify it
rf verify receipts/ci/2026-03-03/12345678.json
```

## What this proves

- A build/test/release/audit happened at a specific time
- The inputs and outputs are content-addressed and tamper-evident
- You can re-verify the receipt at any time with `rf verify`

## What this does NOT prove

- That the underlying code is correct (receipts prove process, not quality)
- That the CI environment itself wasn't compromised (that's a supply chain problem)
- That artifacts haven't been modified after receipt creation (use signing for that)

## Security

See [SECURITY.md](SECURITY.md) for threat model and reporting.

## License

MIT

---

Built by [MCP Tool Shop](https://mcp-tool-shop.github.io/)
