import { NextResponse } from "next/server";
import { is_session_user, require_user } from "@/lib/auth";
import { read_db } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }

  const db = await read_db();
  const active_students = db.students.filter((item) => item.status === "active");
  const active_teachers = db.teachers.filter((item) => item.status === "active");
  const today = new Date().toISOString().slice(0, 10);
  const today_sheets = db.attendance.filter((item) => item.date === today);
  const marked = today_sheets.reduce(
    (sum, sheet) => sum + sheet.records.filter((r) => r.status === "present").length,
    0,
  );
  const expected = today_sheets.reduce((sum, sheet) => sum + sheet.records.length, 0);

  return NextResponse.json({
    stats: {
      students: active_students.length,
      teachers: active_teachers.length,
      classes: db.classes.length,
      attendance_today:
        expected === 0 ? null : Math.round((marked / expected) * 100),
    },
    recent_students: [...db.students]
      .sort((a, b) => b.enrollment_date.localeCompare(a.enrollment_date))
      .slice(0, 5),
    classes: db.classes,
    teachers: db.teachers,
    user,
  });
}
