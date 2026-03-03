# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
