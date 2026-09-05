import { NextResponse } from "next/server";
import {
  apply_session_cookie,
  create_session_token,
  json_error,
} from "@/lib/auth";
import { hash_password } from "@/lib/crypto";
import { update_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (name.length < 2) {
    return json_error("Please enter your full name.");
  }
  if (!email.includes("@")) {
    return json_error("Please enter a valid email address.");
  }
  if (password.length < 8) {
    return json_error("Password must be at least 8 characters.");
  }

  const user = await update_db(async (db) => {
    if (db.users.some((item) => item.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const created = {
      id: crypto.randomUUID(),
      name,
      email,
      password_hash: await hash_password(password),
      role: db.users.length === 0 ? ("admin" as const) : ("staff" as const),
      created_at: new Date().toISOString(),
    };
    db.users.push(created);
    return created;
  }).catch((error: Error) => error);

  if (user instanceof Error) {
    return json_error(user.message, 409);
  }

  const token = await create_session_token({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  apply_session_cookie(response, token);
  return response;
}
