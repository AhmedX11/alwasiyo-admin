"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Card,
  ErrorText,
  Field,
  GhostButton,
  PageHeader,
  PrimaryButton,
  SelectInput,
  TextInput,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { SchoolClass, Student, Teacher } from "@/lib/types";

export default function ClassesPage() {
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [teachers, set_teachers] = useState<Teacher[]>([]);
  const [students, set_students] = useState<Student[]>([]);
  const [error, set_error] = useState("");
  const [form, set_form] = useState({
    name: "",
    grade: "",
    teacher_id: "",
    room: "",
    schedule: "",
  });

  async function load() {
    const data = await api<{
      classes: SchoolClass[];
      teachers: Teacher[];
      students: Student[];
    }>("/api/classes");
    set_classes(data.classes);
    set_teachers(data.teachers);
    set_students(data.students);
  }

  useEffect(() => {
    let active = true;
    api<{
      classes: SchoolClass[];
      teachers: Teacher[];
      students: Student[];
    }>("/api/classes")
      .then((data) => {
        if (!active) {
          return;
        }
        set_classes(data.classes);
        set_teachers(data.teachers);
        set_students(data.students);
      })
      .catch((err: Error) => {
        if (active) {
          set_error(err.message);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_error("");
    try {
      await api("/api/classes", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          teacher_id: form.teacher_id || null,
        }),
      });
      set_form({
        name: "",
        grade: "",
        teacher_id: "",
        room: "",
        schedule: "",
      });
      await load();
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not add class.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this class?")) {
      return;
    }
    await api(`/api/classes/${id}`, { method: "DELETE" });
    await load();
  }

  const teacher_name = (id: string | null) =>
    teachers.find((item) => item.id === id)?.full_name || "Unassigned";
  const count = (id: string) =>
    students.filter((item) => item.class_id === id && item.status === "active")
      .length;

  return (
    <div>
      <PageHeader
        title="Classes"
        description="Morning groups, grades, and the Quran circle."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {error ? <ErrorText message={error} /> : null}
          {classes.map((item) => (
            <Card key={item.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold">
                  {item.grade}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{item.name}</h2>
                <p className="mt-2 text-sm text-muted">
                  {teacher_name(item.teacher_id)} · {item.room} · {item.schedule}
                </p>
                <p className="mt-2 text-sm">{count(item.id)} students</p>
              </div>
              <GhostButton type="button" onClick={() => remove(item.id)}>
                Remove
              </GhostButton>
            </Card>
          ))}
        </div>
        <Card>
          <h2 className="text-lg font-semibold">Add class</h2>
          <form className="mt-5 space-y-4" onSubmit={on_submit}>
            <Field label="Name">
              <TextInput
                value={form.name}
                onChange={(e) => set_form({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Grade">
              <TextInput
                value={form.grade}
                onChange={(e) => set_form({ ...form, grade: e.target.value })}
              />
            </Field>
            <Field label="Teacher">
              <SelectInput
                value={form.teacher_id}
                onChange={(e) =>
                  set_form({ ...form, teacher_id: e.target.value })
                }
              >
                <option value="">Unassigned</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Room">
              <TextInput
                value={form.room}
                onChange={(e) => set_form({ ...form, room: e.target.value })}
              />
            </Field>
            <Field label="Schedule">
              <TextInput
                value={form.schedule}
                onChange={(e) =>
                  set_form({ ...form, schedule: e.target.value })
                }
              />
            </Field>
            <PrimaryButton className="w-full">Save class</PrimaryButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
