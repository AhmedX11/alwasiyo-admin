import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { update_db } from "@/lib/store";
import type { SchoolClass } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<SchoolClass> | null;
  if (!body) {
    return json_error("Invalid payload.");
  }

  const school_class = await update_db((db) => {
    const current = db.classes.find((item) => item.id === id);
    if (!current) {
      return null;
    }
    if (typeof body.name === "string" && body.name.trim()) {
      current.name = body.name.trim();
    }
    if (typeof body.grade === "string") {
      current.grade = body.grade.trim();
    }
    if (body.teacher_id !== undefined) {
      current.teacher_id = body.teacher_id || null;
    }
    if (typeof body.room === "string") {
      current.room = body.room.trim();
    }
    if (typeof body.schedule === "string") {
      current.schedule = body.schedule.trim();
    }
    return current;
  });

  if (!school_class) {
    return json_error("Class not found.", 404);
  }
  return NextResponse.json({ class: school_class });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const removed = await update_db((db) => {
    const exists = db.classes.some((item) => item.id === id);
    db.classes = db.classes.filter((item) => item.id !== id);
    db.students.forEach((item) => {
      if (item.class_id === id) {
        item.class_id = null;
      }
    });
    db.attendance = db.attendance.filter((item) => item.class_id !== id);
    return exists;
  });
  if (!removed) {
    return json_error("Class not found.", 404);
  }
  return NextResponse.json({ ok: true });
}
