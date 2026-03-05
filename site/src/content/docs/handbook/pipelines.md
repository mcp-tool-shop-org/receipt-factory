---
title: Pipelines
description: 5 receipt kinds for CI, releases, audits, and more.
sidebar:
  order: 3
---

## Pipeline overview

Each pipeline produces a specific kind of receipt, proving a different operation happened.

| Pipeline | Receipt Kind | What it proves |
|----------|-------------|----------------|
| `ci-receipts` | `ci_run` | A CI build/test happened with specific inputs and results |
| `release-receipts` | `release` | A release was published with specific assets and commits |
| `registry-sync` | `registry_sync` | What's published vs what's in the repo — drift classification |
| `security-audit` | `audit` | What was scanned, with what tool, what vulnerabilities were found |
| `sbom` | `sbom` | Software bill of materials generated and attested |

## CI receipts

Creates a receipt from a CI run. Captures workflow name, trigger, commit SHA, test results, build artifacts, and timing.

```bash
rf make ci --from github --run 12345678
```

## Release receipts

Captures release metadata: tag, assets, changelog, commit range, and publication timestamp.

```bash
rf make release --from github --tag v1.2.0
```

## Registry sync

Compares what's published in registries (npm, PyPI, etc.) against the repo state. Classifies drift as: in-sync, ahead, behind, or diverged.

## Security audit

Records what was scanned, with which tool (npm audit, pip-audit, etc.), and what vulnerabilities were found.

## SBOM

Generates a software bill of materials receipt — listing all dependencies, their versions, and licenses.
