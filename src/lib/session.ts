import { hmac_sign, hmac_verify } from "@/lib/crypto";
import { SESSION_DAYS } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";

type TokenPayload = SessionUser & { exp: number };

function auth_secret(): string {
  return process.env.AUTH_SECRET || "alwasiyo-dev-secret-change-in-production";
}

export async function create_session_token(user: SessionUser): Promise<string> {
  const payload: TokenPayload = {
    ...user,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = await hmac_sign(auth_secret(), encoded);
  return `${encoded}.${signature}`;
}

export async function verify_session_token(
  token: string,
): Promise<SessionUser | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }
  const valid = await hmac_verify(auth_secret(), encoded, signature);
  if (!valid) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as TokenPayload;
    if (payload.exp < Date.now()) {
      return null;
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
