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
import type { SchoolClass, Teacher } from "@/lib/types";

export default function TeachersPage() {
  const [teachers, set_teachers] = useState<Teacher[]>([]);
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [error, set_error] = useState("");
  const [form, set_form] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
  });

  async function load() {
    const data = await api<{ teachers: Teacher[]; classes: SchoolClass[] }>(
      "/api/teachers",
    );
    set_teachers(data.teachers);
    set_classes(data.classes);
  }

  useEffect(() => {
    let active = true;
    api<{ teachers: Teacher[]; classes: SchoolClass[] }>("/api/teachers")
      .then((data) => {
        if (!active) {
          return;
        }
        set_teachers(data.teachers);
        set_classes(data.classes);
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
      await api("/api/teachers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      set_form({ full_name: "", email: "", phone: "", subject: "" });
      await load();
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not add teacher.");
    }
  }

  async function save(teacher: Teacher) {
    await api(`/api/teachers/${teacher.id}`, {
      method: "PATCH",
      body: JSON.stringify(teacher),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this teacher?")) {
      return;
    }
    await api(`/api/teachers/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Teachers"
        description="Educators supporting the Child Care Home classrooms."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          {error ? <ErrorText message={error} /> : null}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="py-3 font-medium">{teacher.full_name}</td>
                    <td className="py-3">{teacher.subject}</td>
                    <td className="py-3">
                      {teacher.phone}
                      <p className="text-xs text-muted">{teacher.email}</p>
                    </td>
                    <td className="py-3">
                      <SelectInput
                        value={teacher.status}
                        onChange={(e) =>
                          save({
                            ...teacher,
                            status: e.target.value as Teacher["status"],
                          })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </SelectInput>
                    </td>
                    <td className="py-3 text-right">
                      <GhostButton type="button" onClick={() => remove(teacher.id)}>
                        Remove
                      </GhostButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">
            {classes.length} classes currently assigned across the campus.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Add teacher</h2>
          <form className="mt-5 space-y-4" onSubmit={on_submit}>
            <Field label="Full name">
              <TextInput
                value={form.full_name}
                onChange={(e) => set_form({ ...form, full_name: e.target.value })}
                required
              />
            </Field>
            <Field label="Subject">
              <TextInput
                value={form.subject}
                onChange={(e) => set_form({ ...form, subject: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => set_form({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <TextInput
                value={form.phone}
                onChange={(e) => set_form({ ...form, phone: e.target.value })}
              />
            </Field>
            <PrimaryButton className="w-full">Save teacher</PrimaryButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
