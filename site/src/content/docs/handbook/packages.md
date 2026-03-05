---
title: Packages
description: All 10 composable packages.
sidebar:
  order: 2
---

## Package overview

receipt-factory is built from 10 composable packages — use one or all.

| Package | Description |
|---------|-------------|
| `@receipt-factory/core` | Receipt schema, canonicalization, SHA-256 hashing, fluent builder API |
| `@receipt-factory/render` | Markdown + standalone HTML renderers |
| `@receipt-factory/verify` | Schema validation, hash integrity, link verification, policy enforcement |
| `@receipt-factory/sign` | Cosign-based signing — receipts, policies, bundles (detached sidecars) |
| `@receipt-factory/evidence` | Evidence packs — portable, content-addressed evidence bundles |
| `@receipt-factory/index` | Receipt index — scan, search, filter receipt directories |
| `@receipt-factory/policy` | Policy packs — portable, versioned lint configuration |
| `@receipt-factory/bundle` | Receipt bundles — self-verifying truth capsules (zip) |
| `@receipt-factory/adapter-github` | GitHub Actions data fetching via `gh` CLI |
| `@receipt-factory/cli` | The `rf` command — create, collect, render, verify, sign receipts |

## Core

The foundation package. Defines the receipt schema, canonicalization algorithm, and SHA-256 content-addressing. Includes a fluent builder API for programmatic receipt creation.

## Render

Converts receipts into human-readable formats. Supports Markdown and standalone HTML output.

## Verify

Schema validation, hash integrity checks, link verification, and policy enforcement. The primary tool for checking receipt trustworthiness.

## Sign

Cosign-based signing for receipts, policies, and bundles. Uses detached sidecars so the original artifact is never modified.

## Evidence

Portable, content-addressed evidence bundles. Package raw data (logs, artifacts, screenshots) alongside receipts.

## Index

Scan, search, and filter receipt directories. Find receipts by kind, subject, date range, or content.

## Policy

Portable, versioned lint configuration packs. Define what "good" means for your organization and distribute it across repos.

## Bundle

Self-verifying zip bundles with hash manifests. Package receipts + evidence into a portable truth capsule that can be verified offline.

## Adapter: GitHub

Fetches CI run data, release metadata, and workflow information from GitHub Actions via the `gh` CLI.

## CLI

The `rf` command covers the full lifecycle: create, collect, render, verify, sign, bundle, search, and graph.
