import { z } from "zod";

export const receiptKindSchema = z.enum([
  "ci_run",
  "release",
  "registry_sync",
  "audit",
  "delivery",
]);

export const receiptSubjectSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  ref: z.string().optional(),
  url: z.string().url().optional(),
});

export const receiptOutputSchema = z.object({
  name: z.string().min(1),
  digest: z.string().optional(),
  url: z.string().url().optional(),
  size: z.number().int().nonnegative().optional(),
});

export const receiptEvidenceSchema = z.object({
  type: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
});

export const receiptVerificationSchema = z.object({
  steps: z.array(z.string()),
  commands: z.array(z.string()),
});

export const receiptEnvironmentSchema = z.object({
  runner: z.string().optional(),
  os: z.string().optional(),
  tool_versions: z.record(z.string(), z.string()),
});

export const receiptPolicySchema = z.object({
  redacted_fields: z.array(z.string()),
  required_checks: z.array(z.string()),
});

export const receiptIntegritySchema = z.object({
  algorithm: z.literal("sha256"),
  digest: z.string().min(1),
  signature: z.string().optional(),
});

export const receiptSchema = z.object({
  receipt_version: z.literal("1.0.0"),
  kind: receiptKindSchema,
  id: z.string().min(1),
  created_at: z.string().datetime(),
  subject: receiptSubjectSchema,
  intent: z.string().min(1),
  inputs: z.record(z.string(), z.unknown()),
  outputs: z.array(receiptOutputSchema),
  evidence: z.array(receiptEvidenceSchema),
  verification: receiptVerificationSchema,
  environment: receiptEnvironmentSchema,
  policy: receiptPolicySchema,
  integrity: receiptIntegritySchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/** Validate a receipt object. Throws ZodError on failure. */
export function validateReceipt(data: unknown) {
  return receiptSchema.parse(data);
}

/** Safe validation — returns { success, data?, error? } */
export function safeValidateReceipt(data: unknown) {
  return receiptSchema.safeParse(data);
}
