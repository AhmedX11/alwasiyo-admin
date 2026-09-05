import { NextResponse } from "next/server";
import { json_error } from "@/lib/auth";
import { hash_password } from "@/lib/crypto";
import { update_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    password?: string;
  } | null;
  const token = body?.token?.trim() ?? "";
  const password = body?.password ?? "";

  if (!token) {
    return json_error("Reset token is missing.");
  }
  if (password.length < 8) {
    return json_error("Password must be at least 8 characters.");
  }

  const result = await update_db(async (db) => {
    const reset = db.password_resets.find((item) => item.token === token);
    if (!reset) {
      return "invalid" as const;
    }
    if (new Date(reset.expires_at).getTime() < Date.now()) {
      db.password_resets = db.password_resets.filter(
        (item) => item.token !== token,
      );
      return "expired" as const;
    }
    const user = db.users.find((item) => item.id === reset.user_id);
    if (!user) {
      return "invalid" as const;
    }
    user.password_hash = await hash_password(password);
    db.password_resets = db.password_resets.filter(
      (item) => item.token !== token,
    );
    return "ok" as const;
  });

  if (result === "expired") {
    return json_error("This reset link has expired. Please request a new one.");
  }
  if (result !== "ok") {
    return json_error("This reset link is invalid.", 400);
  }

  return NextResponse.json({
    message: "Password updated. You can sign in with your new password.",
  });
}
