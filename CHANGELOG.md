# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-03-03

### Added

- **Receipt References**: Receipts can cite other receipts and evidence packs by hash, forming a verifiable provenance graph
  - `ReceiptReference` type: `kind`, `hash`, `description`, optional `path` and `url`
  - `addReference()` method on `ReceiptBuilder` for fluent chaining
  - `receiptReferenceSchema` (Zod) for validation
  - Ref-check: `checkReferences()` verifies referenced receipts exist and hashes match
- **`@mcptoolshop/rf-policy`**: Policy packs — portable, versioned lint configuration
  - `PolicyPack` and `PolicyRules` types for configurable quality checks
  - `loadPolicy(path)` reads and validates policy JSON, fills missing rules from defaults
  - `DEFAULT_POLICY` and `DEFAULT_RULES` for built-in quality baseline
- **`rf verify --follow`**: Recursively verify referenced receipts up to depth 5
- **`rf verify --policy <path>`**: Use custom policy rules for lint checks
- **`rf graph [dir]`**: Emit JSON graph of receipt-to-receipt references
- **`rf policy init`**: Scaffold a default policy.json file
- **Publish workflow**: `receipt-publish.yml` uploads receipts + index to GitHub Pages

### Changed

- `checkLint()` now accepts optional `PolicyRules` parameter (backward compatible)
- `verifyReceipt()` accepts `follow`, `policy`, and `receiptsDir` options
- Link check now extracts URLs from `references[]` in addition to subject/outputs/evidence
- Receipt index entries include optional `references` array (hashes of referenced receipts)
- 127 tests across 12 packages (up from 108/10)

## [1.2.0] - 2026-03-03

### Added

- **`@mcptoolshop/rf-evidence`**: Evidence packs — portable, content-addressed bundles for offline receipt assembly
  - `writeEvidencePack()` serializes evidence with SHA-256 content hashes
  - `readEvidencePack()` verifies integrity before deserializing
  - Tamper detection: hash + size mismatch throws structured `RfError`
- **`@mcptoolshop/rf-index`**: Receipt index — scan, index, and search receipt directories
  - `buildIndex()` recursively scans for receipt JSON files, builds machine-readable index
  - `searchIndex()` filters by kind, repo name, date range
  - Optional `--validate` flag runs integrity checks during indexing
- **`rf collect` command**: `rf collect <kind> --from github` writes evidence packs for later offline assembly
- **`rf make --from evidence`**: Build receipts from evidence packs without network access
- **`rf index` command**: `rf index [dir]` scans receipts and writes `index.json`
- **`rf search` command**: `rf search --kind ci_run --repo alpha --since 2026-03-01`

### Changed

- CLI `make` command accepts `--from evidence --pack <dir>` in addition to `--from github`
- CLI `make` command accepts `--pack` option for evidence pack directory
- 108 tests across 10 packages (up from 86/8)

## [1.1.0] - 2026-03-03

### Added

- **Golden canonicalization test**: Frozen receipt fixture with expected canonical JSON + SHA-256 hash, proving cross-Node determinism
- **Trust spine**: `canonical_format_version` and `canonical_length_bytes` in integrity block for future-proof verification
- **Signing fields**: `signed_by`, `signed_at`, `rekor_log_id` in integrity for Sigstore integration
- **Strict verify mode**: `rf verify --strict` runs lint checks on human-surface fields (intent quality, evidence, verification steps)
- **Receipt lint**: `rf lint <file>` as alias for `rf verify --strict`
- **`@mcptoolshop/rf-sign`**: Cosign CLI wrapper — `signReceipt()`, `verifySignature()`, keyless (OIDC) and key-based modes
- **`rf sign` command**: `rf sign <file> --keyless|--key <path> [--embed]`
- **Release receipts pipeline**: `rf make release --from github --tag <tag>`
- **GitHub releases adapter**: `fetchRelease(repo, tag)` via `gh api`
- **Reusable release workflow**: `receipt-release.yml` for GitHub Actions
- 86 tests across 8 packages (up from 64/6)

### Changed

- `checkHash()` in verify now returns an array of checks (hash + format version + byte length)
- `verifyReceipt()` accepts `strict` option for lint checks
- `computeIntegrity()` now populates `canonical_format_version` and `canonical_length_bytes`
- CLI `make` command supports `release` kind with `--tag` option

## [1.0.0] - 2026-03-03

### Added

- `@mcptoolshop/rf-core`: Receipt schema (Zod + TypeScript), canonicalization, SHA-256 hashing, fluent builder API
- `@mcptoolshop/rf-render`: Markdown and standalone HTML renderers with human-first front page and technical back matter
- `@mcptoolshop/rf-verify`: Schema validation, hash integrity checking, link reachability verification
- `@mcptoolshop/rf-adapter-github`: GitHub Actions data fetching via `gh` CLI with env var auto-detection
- `@mcptoolshop/rf-cli`: The `rf` command — `make`, `render`, `verify`, `init`
- CI receipts pipeline: collect → assemble → render → write for GitHub Actions runs
- Reusable GitHub Actions workflow (`receipt-ci.yml`) wrapping the CLI
- 64 tests across 6 packages
- Handbook: what is a receipt, how to verify, how to add a pipeline
