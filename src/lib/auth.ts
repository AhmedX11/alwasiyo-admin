import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { create_session_token, verify_session_token } from "@/lib/session";
import type { SessionUser } from "@/lib/types";

export { create_session_token, verify_session_token };

export function apply_session_cookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function clear_session_cookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function get_session_user(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verify_session_token(token);
}

export function json_error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function require_user(): Promise<SessionUser | NextResponse> {
  const user = await get_session_user();
  if (!user) {
    return json_error("Please sign in to continue.", 401);
  }
  return user;
}

export function is_session_user(
  value: SessionUser | NextResponse,
): value is SessionUser {
  return !(value instanceof NextResponse);
}
