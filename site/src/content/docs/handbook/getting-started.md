---
title: Getting Started
description: Install the CLI and create your first receipt.
sidebar:
  order: 1
---

## What is a receipt?

A receipt is a signed, timestamped, reproducible record of what happened:

- **What was done** — actions, inputs, outputs
- **Why it was done** — intent, policy, context
- **Who/what did it** — actor, runner, tool versions
- **Proof it happened** — hashes, links, checksums, logs
- **How to verify it** — commands, re-run instructions

You can read a receipt in 30 seconds and verify it in 2 minutes.

## Install

```bash
npm install -g @receipt-factory/cli
```

## Create a receipt

```bash
# From a GitHub Actions run
rf make ci --from github --run 12345678
```

## Render it

```bash
rf render receipts/ci/2026-03-03/12345678.json --format html
```

## Verify it

```bash
# Basic verification
rf verify receipts/ci/2026-03-03/12345678.json

# Strict with policy enforcement
rf verify receipts/ci/2026-03-03/12345678.json --strict --policy policy.json
```

## Bundle and sign

```bash
# Bundle receipts into a portable capsule
rf bundle create receipts/ci/2026-03-03/12345678.json --follow --policy policy.json

# Sign the bundle
rf bundle sign bundles/abc123.bundle.zip --keyless
```
