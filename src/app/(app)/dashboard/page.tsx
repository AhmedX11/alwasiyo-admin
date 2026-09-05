"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, GraduationCap, Users } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { SchoolClass, Student, Teacher } from "@/lib/types";

type StatsResponse = {
  stats: {
    students: number;
    teachers: number;
    classes: number;
    attendance_today: number | null;
  };
  recent_students: Student[];
  classes: SchoolClass[];
  teachers: Teacher[];
};

export default function DashboardPage() {
  const [data, set_data] = useState<StatsResponse | null>(null);
  const [error, set_error] = useState("");

  useEffect(() => {
    api<StatsResponse>("/api/stats")
      .then(set_data)
      .catch((err: Error) => set_error(err.message));
  }, []);

  const teacher_name = (id: string | null) =>
    data?.teachers.find((item) => item.id === id)?.full_name || "Unassigned";

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A quiet snapshot of children, teachers, and classrooms at Al Wasiyo Child Care Home."
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={GraduationCap}
          label="Active students"
          value={data?.stats.students ?? "—"}
        />
        <Stat
          icon={Users}
          label="Teachers"
          value={data?.stats.teachers ?? "—"}
        />
        <Stat
          icon={BookOpen}
          label="Classes"
          value={data?.stats.classes ?? "—"}
        />
        <Stat
          icon={CalendarCheck}
          label="Attendance today"
          value={
            data?.stats.attendance_today == null
              ? "Not marked"
              : `${data.stats.attendance_today}%`
          }
        />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recently enrolled</h2>
            <Link href="/students" className="text-sm text-forest-mid">
              View all
            </Link>
          </div>
          <div className="divide-y divide-cream-dark">
            {(data?.recent_students ?? []).map((student) => (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-forest"
              >
                <span>
                  <strong className="block">{student.full_name}</strong>
                  <span className="text-muted">{student.code}</span>
                </span>
                <span className="text-muted">{student.enrollment_date}</span>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Classes</h2>
            <Link href="/classes" className="text-sm text-forest-mid">
              Manage
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.classes ?? []).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-cream/70 px-4 py-3 text-sm"
              >
                <p className="font-medium">
                  {item.grade} · {item.name}
                </p>
                <p className="mt-1 text-muted">
                  {teacher_name(item.teacher_id)} · {item.schedule}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <Icon className="h-5 w-5 text-gold" suppressHydrationWarning />
      <p className="mt-4 text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-forest-deep">{value}</p>
    </Card>
  );
}
