import { DEMO_ADMIN } from "@/lib/constants";
import { hash_password } from "@/lib/crypto";
import type { Database } from "@/lib/types";

export async function create_seed(): Promise<Database> {
  const now = "2026-04-01";
  const class_ids = {
    grade3: crypto.randomUUID(),
    grade5: crypto.randomUUID(),
    grade7: crypto.randomUUID(),
    quran: crypto.randomUUID(),
  };
  const teacher_ids = {
    sana: crypto.randomUUID(),
    rabia: crypto.randomUUID(),
    imran: crypto.randomUUID(),
    nadia: crypto.randomUUID(),
  };

  return {
    users: [
      {
        id: crypto.randomUUID(),
        name: "Campus Admin",
        email: DEMO_ADMIN.email,
        password_hash: await hash_password(DEMO_ADMIN.password),
        role: "admin",
        created_at: new Date().toISOString(),
      },
    ],
    teachers: [
      {
        id: teacher_ids.sana,
        full_name: "Sana Malik",
        email: "sana.malik@alwasiyo.org",
        phone: "0301-5552101",
        subject: "English",
        status: "active",
        joined_at: "2022-08-15",
      },
      {
        id: teacher_ids.rabia,
        full_name: "Rabia Ahmed",
        email: "rabia.ahmed@alwasiyo.org",
        phone: "0321-5558822",
        subject: "Mathematics",
        status: "active",
        joined_at: "2021-03-10",
      },
      {
        id: teacher_ids.imran,
        full_name: "Imran Sheikh",
        email: "imran.sheikh@alwasiyo.org",
        phone: "0333-4410099",
        subject: "Quran & Islamic Studies",
        status: "active",
        joined_at: "2020-01-06",
      },
      {
        id: teacher_ids.nadia,
        full_name: "Nadia Farooq",
        email: "nadia.farooq@alwasiyo.org",
        phone: "0345-7781200",
        subject: "General Science",
        status: "active",
        joined_at: "2023-09-01",
      },
    ],
    classes: [
      {
        id: class_ids.grade3,
        name: "Morning Circle",
        grade: "Grade 3",
        teacher_id: teacher_ids.sana,
        room: "Room A",
        schedule: "Mon–Fri · 08:30–12:30",
      },
      {
        id: class_ids.grade5,
        name: "Little Scholars",
        grade: "Grade 5",
        teacher_id: teacher_ids.rabia,
        room: "Room B",
        schedule: "Mon–Fri · 08:30–13:00",
      },
      {
        id: class_ids.grade7,
        name: "Rising Stars",
        grade: "Grade 7",
        teacher_id: teacher_ids.nadia,
        room: "Room C",
        schedule: "Mon–Fri · 08:30–14:00",
      },
      {
        id: class_ids.quran,
        name: "Quran Circle",
        grade: "All grades",
        teacher_id: teacher_ids.imran,
        room: "Prayer Hall",
        schedule: "Sat–Thu · 16:00–17:30",
      },
    ],
    students: [
      student("AW-1001", "Ayesha Khan", "2016-03-12", class_ids.grade3, now, "Lahore"),
      student("AW-1002", "Fatima Ali", "2016-07-21", class_ids.grade3, now, "Lahore"),
      student("AW-1003", "Zainab Hassan", "2015-11-02", class_ids.grade5, now, "Kasur"),
      student("AW-1004", "Maryam Noor", "2014-01-18", class_ids.grade5, now, "Lahore"),
      student("AW-1005", "Hira Siddiqui", "2013-09-09", class_ids.grade7, now, "Sheikhupura"),
      student("AW-1006", "Iqra Raza", "2013-05-30", class_ids.grade7, now, "Lahore"),
      student("AW-1007", "Amina Yousaf", "2016-12-04", class_ids.grade3, now, "Lahore"),
      student("AW-1008", "Noor Fatima", "2014-08-14", class_ids.grade5, now, "Gujranwala"),
    ],
    attendance: [],
    password_resets: [],
  };
}

function student(
  code: string,
  full_name: string,
  date_of_birth: string,
  class_id: string,
  enrollment_date: string,
  city: string,
) {
  return {
    id: crypto.randomUUID(),
    code,
    full_name,
    gender: "female" as const,
    date_of_birth,
    guardian_name: "Child Care Home",
    guardian_phone: "0300-4005653",
    class_id,
    status: "active" as const,
    enrollment_date,
    address: `${city}, Punjab`,
    notes: "Resident of Al Wasiyo Child Care Home.",
  };
}
