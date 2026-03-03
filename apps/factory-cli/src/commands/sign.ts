import { signReceipt } from "@mcptoolshop/rf-sign";

export interface SignOptions {
  keyless: boolean;
  key?: string;
  embed: boolean;
}

export async function handleSign(file: string, opts: SignOptions): Promise<void> {
  try {
    const result = await signReceipt(file, {
      keyless: opts.keyless,
      keyPath: opts.key,
      embed: opts.embed,
    });

    console.log(`Signed: ${file}`);
    console.log(`  Digest: ${result.digest}`);
    console.log(`  Signed at: ${result.signedAt}`);
    if (result.sidecarPaths?.signature) {
      console.log(`  Signature: ${result.sidecarPaths.signature}`);
    }
    if (result.sidecarPaths?.certificate) {
      console.log(`  Certificate: ${result.sidecarPaths.certificate}`);
    }
    if (opts.embed) {
      console.log(`  Embedded signature into receipt`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[RF_SIGN] ${message}`);
    process.exit(2);
  }
}
