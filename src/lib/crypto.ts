const encoder = new TextEncoder();

function to_b64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function from_b64(value: string): Uint8Array<ArrayBuffer> {
  const bytes = Buffer.from(value, "base64url");
  return Uint8Array.from(bytes);
}

function as_bytes(value: Uint8Array): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(value);
}

export async function hash_password(password: string): Promise<string> {
  const iterations = 100_000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: as_bytes(salt), iterations },
    key,
    256,
  );
  return `pbkdf2$${iterations}$${to_b64(salt)}$${to_b64(new Uint8Array(bits))}`;
}

export async function verify_password(
  password: string,
  stored: string,
): Promise<boolean> {
  const [scheme, iter, salt_b64, hash_b64] = stored.split("$");
  if (scheme !== "pbkdf2" || !iter || !salt_b64 || !hash_b64) {
    return false;
  }
  const iterations = Number(iter);
  const salt = from_b64(salt_b64);
  const expected = from_b64(hash_b64);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: as_bytes(salt), iterations },
    key,
    expected.length * 8,
  );
  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) {
    diff |= actual[i] ^ expected[i];
  }
  return diff === 0;
}

export async function hmac_sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return to_b64(new Uint8Array(sig));
}

export async function hmac_verify(
  secret: string,
  payload: string,
  signature: string,
): Promise<boolean> {
  const expected = await hmac_sign(secret, payload);
  if (expected.length !== signature.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function random_token(): string {
  return to_b64(crypto.getRandomValues(new Uint8Array(32)));
}
