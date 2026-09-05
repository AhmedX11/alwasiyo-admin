"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  ErrorText,
  Field,
  PageHeader,
  PrimaryButton,
  SelectInput,
  TextInput,
} from "@/components/ui";
import { api } from "@/lib/api";
import type {
  AttendanceRecord,
  AttendanceSheet,
  AttendanceStatus,
  SchoolClass,
  Student,
} from "@/lib/types";

export default function AttendancePage() {
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [students, set_students] = useState<Student[]>([]);
  const [sheet, set_sheet] = useState<AttendanceSheet | null>(null);
  const [class_id, set_class_id] = useState("");
  const [date, set_date] = useState(new Date().toISOString().slice(0, 10));
  const [records, set_records] = useState<AttendanceRecord[]>([]);
  const [error, set_error] = useState("");
  const [saved, set_saved] = useState("");

  async function load(next_class = class_id, next_date = date) {
    const query = next_class
      ? `?class_id=${next_class}&date=${next_date}`
      : "";
    const data = await api<{
      classes: SchoolClass[];
      students: Student[];
      sheet?: AttendanceSheet | null;
    }>(`/api/attendance${query}`);
    set_classes(data.classes);
    set_students(data.students);
    if (!next_class && data.classes[0]) {
      set_class_id(data.classes[0].id);
      return load(data.classes[0].id, next_date);
    }
    set_sheet(data.sheet ?? null);
    const existing = data.sheet?.records ?? [];
    set_records(
      data.students.map((student) => {
        const found = existing.find((item) => item.student_id === student.id);
        return { student_id: student.id, status: found?.status ?? "present" };
      }),
    );
  }

  useEffect(() => {
    load().catch((err: Error) => set_error(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const present = useMemo(
    () => records.filter((item) => item.status === "present").length,
    [records],
  );

  async function save() {
    set_error("");
    set_saved("");
    try {
      await api("/api/attendance", {
        method: "PUT",
        body: JSON.stringify({ class_id, date, records }),
      });
      set_saved("Attendance saved.");
      await load(class_id, date);
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark who was present in each class today."
      />
      <Card className="mb-6 grid gap-4 sm:grid-cols-3">
        <Field label="Class">
          <SelectInput
            value={class_id}
            onChange={(e) => {
              set_class_id(e.target.value);
              load(e.target.value, date).catch((err: Error) =>
                set_error(err.message),
              );
            }}
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.grade} · {item.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Date">
          <TextInput
            type="date"
            value={date}
            onChange={(e) => {
              set_date(e.target.value);
              load(class_id, e.target.value).catch((err: Error) =>
                set_error(err.message),
              );
            }}
          />
        </Field>
        <div className="flex items-end">
          <p className="text-sm text-muted">
            {present} of {records.length} present
            {sheet ? " · sheet saved" : ""}
          </p>
        </div>
      </Card>
      <Card>
        <ErrorText message={error} />
        {saved ? <p className="mb-4 text-sm text-forest-mid">{saved}</p> : null}
        <div className="divide-y divide-cream-dark">
          {students.map((student) => {
            const record = records.find((item) => item.student_id === student.id);
            return (
              <div
                key={student.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{student.full_name}</p>
                  <p className="text-xs text-muted">{student.code}</p>
                </div>
                <SelectInput
                  className="sm:max-w-48"
                  value={record?.status ?? "present"}
                  onChange={(e) =>
                    set_records((current) =>
                      current.map((item) =>
                        item.student_id === student.id
                          ? {
                              ...item,
                              status: e.target.value as AttendanceStatus,
                            }
                          : item,
                      ),
                    )
                  }
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </SelectInput>
              </div>
            );
          })}
        </div>
        <PrimaryButton className="mt-6" onClick={save} type="button">
          Save attendance
        </PrimaryButton>
      </Card>
    </div>
  );
}
