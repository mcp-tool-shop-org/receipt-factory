---
title: CLI Reference
description: Every rf command in detail.
sidebar:
  order: 5
---

## rf make

Create a receipt from a data source.

```bash
rf make <kind> --from <source> [options]
```

| Kind | Source | Example |
|------|--------|---------|
| `ci` | `github` | `rf make ci --from github --run 12345678` |
| `release` | `github` | `rf make release --from github --tag v1.2.0` |
| `audit` | `evidence` | `rf make audit --from evidence --pack evidence/audit/` |

## rf collect

Collect raw data into an evidence pack for offline receipt creation.

```bash
rf collect <kind> --run <id>
```

## rf render

Render a receipt as Markdown or standalone HTML.

```bash
rf render <file> --format <md|html>
```

## rf verify

Validate schema, hash integrity, links, and policy compliance.

```bash
rf verify <file> [--strict] [--policy <file>]
```

- `--strict` — Fail on warnings, not just errors
- `--policy` — Apply a policy pack for governance checks

## rf bundle create

Package receipts and evidence into a self-verifying zip capsule.

```bash
rf bundle create <file> [--follow] [--policy <file>]
```

- `--follow` — Include referenced evidence packs
- `--policy` — Embed policy for offline verification

## rf bundle sign

Sign a bundle with cosign (detached sidecar).

```bash
rf bundle sign <file> --keyless
```

## rf search

Search receipt directories by kind, subject, or date range.

```bash
rf search <dir> --kind <kind> [--subject <query>]
```

## rf graph

Emit a JSON graph of receipt-to-receipt references.

```bash
rf graph <dir>
```
