import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { read_db, update_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const db = await read_db();
  return NextResponse.json({
    classes: db.classes,
    teachers: db.teachers,
    students: db.students,
  });
}

export async function POST(request: Request) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    grade?: string;
    teacher_id?: string | null;
    room?: string;
    schedule?: string;
  } | null;

  const name = body?.name?.trim() ?? "";
  if (name.length < 2) {
    return json_error("Class name is required.");
  }

  const school_class = await update_db((db) => {
    const created = {
      id: crypto.randomUUID(),
      name,
      grade: body?.grade?.trim() || "",
      teacher_id: body?.teacher_id || null,
      room: body?.room?.trim() || "",
      schedule: body?.schedule?.trim() || "",
    };
    db.classes.push(created);
    return created;
  });

  return NextResponse.json({ class: school_class }, { status: 201 });
}
