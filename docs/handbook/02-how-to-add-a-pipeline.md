# How to Add a Pipeline

Pipelines are specialized assembly lines. Each one knows how to collect evidence from a specific source and assemble it into a receipt.

## Pipeline interface

Every pipeline implements two functions:

```typescript
// 1. Collect raw evidence from the source
async function collect(source: string, opts: Options): Promise<EvidenceBundle>;

// 2. Assemble a receipt from the evidence
function assemble(evidence: EvidenceBundle): Receipt;
```

Rendering and verification are handled by the shared `@mcptoolshop/rf-render` and `@mcptoolshop/rf-verify` packages. Don't duplicate that logic.

## Adding a new pipeline

1. Create a directory under `pipelines/`:

```
pipelines/
  my-pipeline/
    package.json
    tsconfig.json
    src/
      index.ts
      collect.ts
      assemble.ts
      pipeline.ts
```

2. Set up `package.json`:

```json
{
  "name": "@mcptoolshop/rf-pipeline-my",
  "private": true,
  "type": "module",
  "dependencies": {
    "@mcptoolshop/rf-core": "workspace:*",
    "@mcptoolshop/rf-render": "workspace:*"
  }
}
```

3. Implement `collect.ts` — fetch raw data from your source.

4. Implement `assemble.ts` — use `ReceiptBuilder` to construct the receipt:

```typescript
import { ReceiptBuilder } from "@mcptoolshop/rf-core";

export function assemble(evidence: MyEvidence): Receipt {
  return new ReceiptBuilder("my_kind")
    .subject({ type: "...", name: "..." })
    .intent("What happened and why")
    .addOutput({ name: "artifact", digest: "sha256:..." })
    .addEvidence({ type: "...", url: "...", description: "..." })
    .addStep("How to verify this")
    .addCommand("rf verify ...")
    .build();
}
```

5. Implement `pipeline.ts` — orchestrate collect + assemble + render + write.

6. Add a CLI command in `apps/factory-cli/src/commands/make.ts`.

7. Write tests.

## Conventions

- Pipeline packages are `private: true` (not published to npm)
- The CLI is the public entry point — pipelines are internal
- Evidence types are specific to each pipeline
- Receipt kinds must be added to `ReceiptKind` in `@mcptoolshop/rf-core`
- Always include "what this does NOT prove" in the receipt intent
