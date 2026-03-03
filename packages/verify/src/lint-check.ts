import type { VerificationCheck } from "./types.js";

interface LintableReceipt {
  intent?: string;
  verification?: { steps?: string[]; commands?: string[] };
  evidence?: Array<{ type?: string; url?: string; description?: string }>;
  metadata?: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  subject?: { url?: string; name?: string };
  policy?: { required_checks?: string[] };
}

/**
 * Lint checks for receipt quality — human-surface field completeness.
 * These don't check structural validity (that's schema-check), they check
 * whether the receipt is *useful* for a human reader.
 *
 * Only run in --strict mode.
 */
export function checkLint(
  receipt: Record<string, unknown>,
): VerificationCheck[] {
  const r = receipt as unknown as LintableReceipt;
  const checks: VerificationCheck[] = [];

  // 1. Intent is meaningful (not just "test" or empty-ish)
  const intent = r.intent ?? "";
  if (intent.length < 10) {
    checks.push({
      name: "lint:intent",
      passed: false,
      message: `Intent is too short (${intent.length} chars, minimum 10)`,
      details: { intent },
    });
  } else {
    checks.push({
      name: "lint:intent",
      passed: true,
      message: "Intent is descriptive",
    });
  }

  // 2. At least 1 verification step
  const steps = r.verification?.steps ?? [];
  if (steps.length === 0) {
    checks.push({
      name: "lint:verification_steps",
      passed: false,
      message: "No verification steps — readers won't know how to verify this",
    });
  } else {
    checks.push({
      name: "lint:verification_steps",
      passed: true,
      message: `${steps.length} verification step(s)`,
    });
  }

  // 3. At least 1 verification command
  const commands = r.verification?.commands ?? [];
  if (commands.length === 0) {
    checks.push({
      name: "lint:verification_commands",
      passed: false,
      message:
        "No verification commands — there should be at least one runnable command",
    });
  } else {
    checks.push({
      name: "lint:verification_commands",
      passed: true,
      message: `${commands.length} verification command(s)`,
    });
  }

  // 4. At least 1 evidence entry
  const evidence = r.evidence ?? [];
  if (evidence.length === 0) {
    checks.push({
      name: "lint:evidence",
      passed: false,
      message: "No evidence — receipts should link to verifiable sources",
    });
  } else {
    checks.push({
      name: "lint:evidence",
      passed: true,
      message: `${evidence.length} evidence link(s)`,
    });
  }

  // 5. Has metadata or meaningful inputs
  const hasMetadata =
    r.metadata != null && Object.keys(r.metadata).length > 0;
  const hasInputs = r.inputs != null && Object.keys(r.inputs).length > 0;
  if (!hasMetadata && !hasInputs) {
    checks.push({
      name: "lint:context",
      passed: false,
      message:
        "No metadata or inputs — receipts should include context about how they were produced",
    });
  } else {
    checks.push({
      name: "lint:context",
      passed: true,
      message: "Receipt has contextual metadata or inputs",
    });
  }

  // 6. Subject has a URL (not just a name)
  if (!r.subject?.url) {
    checks.push({
      name: "lint:subject_url",
      passed: false,
      message:
        "Subject has no URL — readers should be able to navigate to the subject",
    });
  } else {
    checks.push({
      name: "lint:subject_url",
      passed: true,
      message: "Subject has a URL",
    });
  }

  // 7. Policy has required checks
  const requiredChecks = r.policy?.required_checks ?? [];
  if (requiredChecks.length === 0) {
    checks.push({
      name: "lint:required_checks",
      passed: false,
      message:
        "No required_checks in policy — declare what checks must pass for this receipt to be trusted",
    });
  } else {
    checks.push({
      name: "lint:required_checks",
      passed: true,
      message: `${requiredChecks.length} required check(s) declared`,
    });
  }

  return checks;
}
