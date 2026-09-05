import { NextResponse } from "next/server";
import { json_error } from "@/lib/auth";
import { random_token } from "@/lib/crypto";
import { update_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  if (!email.includes("@")) {
    return json_error("Please enter a valid email address.");
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const reset_url = await update_db((db) => {
    const user = db.users.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    const token = random_token();
    db.password_resets = db.password_resets.filter(
      (item) => item.user_id !== user.id,
    );
    db.password_resets.push({
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    return `${origin}/reset-password?token=${encodeURIComponent(token)}`;
  });

  return NextResponse.json({
    message:
      "If an account exists for that email, a reset link has been created. For this demo, the link is returned below instead of email.",
    reset_url,
  });
}
