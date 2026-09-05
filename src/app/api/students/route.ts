import { NextResponse } from "next/server";
import { is_session_user, json_error, require_user } from "@/lib/auth";
import { read_db, update_db } from "@/lib/store";
import type { Gender, StudentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function next_code(existing: string[]) {
  const numbers = existing
    .map((code) => Number(code.replace(/\D/g, "")))
    .filter((value) => Number.isFinite(value));
  const next = (numbers.length ? Math.max(...numbers) : 1000) + 1;
  return `AW-${next}`;
}

export async function GET() {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }
  const db = await read_db();
  return NextResponse.json({
    students: db.students,
    classes: db.classes,
  });
}

export async function POST(request: Request) {
  const user = await require_user();
  if (!is_session_user(user)) {
    return user;
  }

  const body = (await request.json().catch(() => null)) as {
    full_name?: string;
    gender?: Gender;
    date_of_birth?: string;
    guardian_name?: string;
    guardian_phone?: string;
    class_id?: string | null;
    status?: StudentStatus;
    enrollment_date?: string;
    address?: string;
    notes?: string;
  } | null;

  const full_name = body?.full_name?.trim() ?? "";
  if (full_name.length < 2) {
    return json_error("Student name is required.");
  }

  const student = await update_db((db) => {
    const created = {
      id: crypto.randomUUID(),
      code: next_code(db.students.map((item) => item.code)),
      full_name,
      gender: body?.gender === "male" ? ("male" as const) : ("female" as const),
      date_of_birth: body?.date_of_birth || "",
      guardian_name: body?.guardian_name?.trim() || "Child Care Home",
      guardian_phone: body?.guardian_phone?.trim() || "",
      class_id: body?.class_id || null,
      status: body?.status || "active",
      enrollment_date:
        body?.enrollment_date || new Date().toISOString().slice(0, 10),
      address: body?.address?.trim() || "",
      notes: body?.notes?.trim() || "",
    };
    db.students.push(created);
    return created;
  });

  return NextResponse.json({ student }, { status: 201 });
}
