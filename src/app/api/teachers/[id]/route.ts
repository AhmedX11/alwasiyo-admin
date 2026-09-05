import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { update_db } from "@/lib/store";
import type { Teacher, TeacherStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<Teacher> | null;
  if (!body) {
    return json_error("Invalid payload.");
  }

  const teacher = await update_db((db) => {
    const current = db.teachers.find((item) => item.id === id);
    if (!current) {
      return null;
    }
    if (typeof body.full_name === "string" && body.full_name.trim()) {
      current.full_name = body.full_name.trim();
    }
    if (typeof body.email === "string") {
      current.email = body.email.trim().toLowerCase();
    }
    if (typeof body.phone === "string") {
      current.phone = body.phone.trim();
    }
    if (typeof body.subject === "string") {
      current.subject = body.subject.trim();
    }
    if (body.status) {
      current.status = body.status as TeacherStatus;
    }
    if (typeof body.joined_at === "string") {
      current.joined_at = body.joined_at;
    }
    return current;
  });

  if (!teacher) {
    return json_error("Teacher not found.", 404);
  }
  return NextResponse.json({ teacher });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const removed = await update_db((db) => {
    const exists = db.teachers.some((item) => item.id === id);
    db.teachers = db.teachers.filter((item) => item.id !== id);
    db.classes.forEach((item) => {
      if (item.teacher_id === id) {
        item.teacher_id = null;
      }
    });
    return exists;
  });
  if (!removed) {
    return json_error("Teacher not found.", 404);
  }
  return NextResponse.json({ ok: true });
}
