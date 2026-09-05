import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { read_db, update_db } from "@/lib/store";
import type { AttendanceRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const url = new URL(request.url);
  const class_id = url.searchParams.get("class_id");
  const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const db = await read_db();

  if (!class_id) {
    return NextResponse.json({
      classes: db.classes,
      students: db.students,
      attendance: db.attendance,
    });
  }

  const students = db.students.filter(
    (item) => item.class_id === class_id && item.status === "active",
  );
  const sheet = db.attendance.find(
    (item) => item.class_id === class_id && item.date === date,
  );

  return NextResponse.json({
    classes: db.classes,
    students,
    sheet: sheet ?? null,
    date,
  });
}

export async function PUT(request: Request) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const body = (await request.json().catch(() => null)) as {
    class_id?: string;
    date?: string;
    records?: AttendanceRecord[];
  } | null;

  if (!body?.class_id || !body.date || !Array.isArray(body.records)) {
    return json_error("Class, date, and attendance records are required.");
  }

  const sheet = await update_db((db) => {
    const existing = db.attendance.find(
      (item) => item.class_id === body.class_id && item.date === body.date,
    );
    if (existing) {
      existing.records = body.records!;
      existing.updated_at = new Date().toISOString();
      return existing;
    }
    const created = {
      id: crypto.randomUUID(),
      class_id: body.class_id!,
      date: body.date!,
      records: body.records!,
      updated_at: new Date().toISOString(),
    };
    db.attendance.push(created);
    return created;
  });

  return NextResponse.json({ sheet });
}
