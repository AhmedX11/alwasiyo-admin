import { NextResponse } from "next/server";
import { clear_session_cookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clear_session_cookie(response);
  return response;
}
