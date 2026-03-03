# How to Verify a Receipt

Verification is the whole point. A receipt you can't verify is just a story.

## Quick verification

```bash
# Install the CLI
npm install -g @mcptoolshop/rf-cli

# Verify a receipt
rf verify receipts/ci/2026-03-03/12345.json
```

This runs three checks:

1. **Schema** — Is the receipt structurally valid?
2. **Hash** — Does the content match the stored digest?
3. **Links** — Are the evidence URLs reachable?

## Offline verification

If you can't reach the network (or don't want to):

```bash
rf verify receipts/ci/2026-03-03/12345.json --offline
```

This skips the link check but still validates schema and hash integrity.

## What each check means

### Schema check

The receipt is validated against the v1.0.0 schema. This catches structural problems: missing fields, wrong types, invalid URLs.

If this fails, the receipt is malformed.

### Hash check

The receipt's `integrity.digest` is recomputed from the canonical JSON (everything except `id` and `integrity`). If the recomputed hash doesn't match, the receipt has been modified since creation.

If this fails, the receipt has been tampered with.

### Link check

Every URL in the receipt (subject, outputs, evidence) gets an HTTP HEAD request. If a link returns 4xx/5xx or is unreachable, it's flagged.

Link failures don't necessarily mean the receipt is invalid — URLs can expire (artifact retention, repo deletions). But they reduce the receipt's provenance strength.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | Bad input (file not found, parse error) |
| 2 | Runtime error (network failure) |
| 3 | Verification failed (one or more checks) |

## Manual verification

You can also verify by hand:

1. Open the JSON file
2. Remove the `id` and `integrity` fields
3. Serialize the rest as canonical JSON (sorted keys, no whitespace)
4. Compute SHA-256 of the result
5. Compare with the stored `integrity.digest`

```bash
# Using jq and shasum
cat receipt.json | jq -cS 'del(.id, .integrity)' | shasum -a 256
```
