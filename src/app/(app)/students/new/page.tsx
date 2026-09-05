"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  ErrorText,
  Field,
  PageHeader,
  PrimaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { SchoolClass } from "@/lib/types";

export default function NewStudentPage() {
  const router = useRouter();
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);
  const [form, set_form] = useState({
    full_name: "",
    gender: "female",
    date_of_birth: "",
    guardian_name: "Child Care Home",
    guardian_phone: "0300-4005653",
    class_id: "",
    enrollment_date: new Date().toISOString().slice(0, 10),
    address: "Lahore",
    notes: "",
  });

  useEffect(() => {
    api<{ classes: SchoolClass[] }>("/api/students").then((data) =>
      set_classes(data.classes),
    );
  }, []);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_loading(true);
    set_error("");
    try {
      const result = await api<{ student: { id: string } }>("/api/students", {
        method: "POST",
        body: JSON.stringify({ ...form, class_id: form.class_id || null }),
      });
      router.push(`/students/${result.student.id}`);
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not save student.");
    } finally {
      set_loading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Add student"
        description="Create a child record for the Child Care Home."
      />
      <Card className="max-w-3xl">
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={on_submit}>
          <div className="sm:col-span-2">
            <ErrorText message={error} />
          </div>
          <Field label="Full name">
            <TextInput
              value={form.full_name}
              onChange={(e) => set_form({ ...form, full_name: e.target.value })}
              required
            />
          </Field>
          <Field label="Gender">
            <SelectInput
              value={form.gender}
              onChange={(e) => set_form({ ...form, gender: e.target.value })}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </SelectInput>
          </Field>
          <Field label="Date of birth">
            <TextInput
              type="date"
              value={form.date_of_birth}
              onChange={(e) =>
                set_form({ ...form, date_of_birth: e.target.value })
              }
            />
          </Field>
          <Field label="Enrollment date">
            <TextInput
              type="date"
              value={form.enrollment_date}
              onChange={(e) =>
                set_form({ ...form, enrollment_date: e.target.value })
              }
            />
          </Field>
          <Field label="Guardian">
            <TextInput
              value={form.guardian_name}
              onChange={(e) =>
                set_form({ ...form, guardian_name: e.target.value })
              }
            />
          </Field>
          <Field label="Guardian phone">
            <TextInput
              value={form.guardian_phone}
              onChange={(e) =>
                set_form({ ...form, guardian_phone: e.target.value })
              }
            />
          </Field>
          <Field label="Class">
            <SelectInput
              value={form.class_id}
              onChange={(e) => set_form({ ...form, class_id: e.target.value })}
            >
              <option value="">Unassigned</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.grade} · {item.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Address / city">
            <TextInput
              value={form.address}
              onChange={(e) => set_form({ ...form, address: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <TextArea
                value={form.notes}
                onChange={(e) => set_form({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton disabled={loading}>
              {loading ? "Saving…" : "Save student"}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
