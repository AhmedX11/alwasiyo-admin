"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, PageHeader, TextInput, primary_button_class } from "@/components/ui";
import { api } from "@/lib/api";
import type { SchoolClass, Student } from "@/lib/types";

export default function StudentsPage() {
  const [students, set_students] = useState<Student[]>([]);
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [query, set_query] = useState("");
  const [error, set_error] = useState("");

  useEffect(() => {
    api<{ students: Student[]; classes: SchoolClass[] }>("/api/students")
      .then((data) => {
        set_students(data.students);
        set_classes(data.classes);
      })
      .catch((err: Error) => set_error(err.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return students.filter((item) =>
      `${item.full_name} ${item.code} ${item.guardian_name}`
        .toLowerCase()
        .includes(needle),
    );
  }, [students, query]);

  const class_name = (id: string | null) =>
    classes.find((item) => item.id === id)?.grade || "Unassigned";

  return (
    <div>
      <PageHeader
        title="Students"
        description="Children currently in the Child Care Home education programme."
        action={
          <Link href="/students/new" className={primary_button_class}>
            Add student
          </Link>
        }
      />
      <Card>
        <TextInput
          placeholder="Search by name, code, or guardian"
          value={query}
          onChange={(e) => set_query(e.target.value)}
        />
        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Guardian</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td className="py-3">
                    <Link
                      href={`/students/${student.id}`}
                      className="font-medium text-forest hover:underline"
                    >
                      {student.full_name}
                    </Link>
                    <p className="text-xs text-muted">{student.code}</p>
                  </td>
                  <td className="py-3">{class_name(student.class_id)}</td>
                  <td className="py-3">
                    {student.guardian_name}
                    <p className="text-xs text-muted">{student.guardian_phone}</p>
                  </td>
                  <td className="py-3 capitalize">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
