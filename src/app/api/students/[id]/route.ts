import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { read_db, update_db } from "@/lib/store";
import type { Gender, Student, StudentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const db = await read_db();
  const student = db.students.find((item) => item.id === id);
  if (!student) {
    return json_error("Student not found.", 404);
  }
  return NextResponse.json({ student, classes: db.classes });
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<Student> | null;
  if (!body) {
    return json_error("Invalid payload.");
  }

  const student = await update_db((db) => {
    const current = db.students.find((item) => item.id === id);
    if (!current) {
      return null;
    }
    if (typeof body.full_name === "string" && body.full_name.trim()) {
      current.full_name = body.full_name.trim();
    }
    if (body.gender === "male" || body.gender === "female") {
      current.gender = body.gender as Gender;
    }
    if (typeof body.date_of_birth === "string") {
      current.date_of_birth = body.date_of_birth;
    }
    if (typeof body.guardian_name === "string") {
      current.guardian_name = body.guardian_name.trim();
    }
    if (typeof body.guardian_phone === "string") {
      current.guardian_phone = body.guardian_phone.trim();
    }
    if (body.class_id !== undefined) {
      current.class_id = body.class_id || null;
    }
    if (body.status) {
      current.status = body.status as StudentStatus;
    }
    if (typeof body.enrollment_date === "string") {
      current.enrollment_date = body.enrollment_date;
    }
    if (typeof body.address === "string") {
      current.address = body.address.trim();
    }
    if (typeof body.notes === "string") {
      current.notes = body.notes.trim();
    }
    return current;
  });

  if (!student) {
    return json_error("Student not found.", 404);
  }
  return NextResponse.json({ student });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const { id } = await params;
  const removed = await update_db((db) => {
    const exists = db.students.some((item) => item.id === id);
    db.students = db.students.filter((item) => item.id !== id);
    return exists;
  });
  if (!removed) {
    return json_error("Student not found.", 404);
  }
  return NextResponse.json({ ok: true });
}
