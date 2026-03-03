# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
