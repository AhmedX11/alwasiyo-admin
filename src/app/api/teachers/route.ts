import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { read_db, update_db } from "@/lib/store";
import type { TeacherStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const db = await read_db();
  return NextResponse.json({ teachers: db.teachers, classes: db.classes });
}

export async function POST(request: Request) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const body = (await request.json().catch(() => null)) as {
    full_name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    status?: TeacherStatus;
    joined_at?: string;
  } | null;

  const full_name = body?.full_name?.trim() ?? "";
  if (full_name.length < 2) {
    return json_error("Teacher name is required.");
  }

  const teacher = await update_db((db) => {
    const created = {
      id: crypto.randomUUID(),
      full_name,
      email: body?.email?.trim().toLowerCase() || "",
      phone: body?.phone?.trim() || "",
      subject: body?.subject?.trim() || "",
      status: body?.status || "active",
      joined_at: body?.joined_at || new Date().toISOString().slice(0, 10),
    };
    db.teachers.push(created);
    return created;
  });

  return NextResponse.json({ teacher }, { status: 201 });
}
