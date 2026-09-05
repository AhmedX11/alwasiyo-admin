import { NextResponse } from "next/server";
import { get_session_user, json_error } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await get_session_user();
  if (!user) {
    return json_error("Not signed in.", 401);
  }
  return NextResponse.json({ user });
}
