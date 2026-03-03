import { fetchCIEvidence } from "@mcptoolshop/rf-adapter-github";
import type { GitHubCIEvidence, FetchOptions } from "@mcptoolshop/rf-adapter-github";

export type { GitHubCIEvidence };

/**
 * Collect CI evidence from the specified source.
 * Currently only supports GitHub Actions.
 */
export async function collect(
  source: "github",
  opts: FetchOptions = {},
): Promise<GitHubCIEvidence> {
  if (source !== "github") {
    throw new Error(`Unsupported source: ${source}. Only "github" is supported.`);
  }

  return fetchCIEvidence(opts);
}
