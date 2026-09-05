import { NextResponse } from "next/server";
import {
  apply_session_cookie,
  create_session_token,
  json_error,
} from "@/lib/auth";
import { verify_password } from "@/lib/crypto";
import { read_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return json_error("Email and password are required.");
  }

  const db = await read_db();
  const user = db.users.find((item) => item.email === email);
  if (!user || !(await verify_password(password, user.password_hash))) {
    return json_error("Incorrect email or password.", 401);
  }

  const token = await create_session_token({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
  apply_session_cookie(response, token);
  return response;
}
