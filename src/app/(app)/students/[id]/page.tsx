"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  ErrorText,
  Field,
  GhostButton,
  PageHeader,
  PrimaryButton,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { SchoolClass, Student } from "@/lib/types";

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [student, set_student] = useState<Student | null>(null);
  const [classes, set_classes] = useState<SchoolClass[]>([]);
  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  useEffect(() => {
    api<{ student: Student; classes: SchoolClass[] }>(`/api/students/${params.id}`)
      .then((data) => {
        set_student(data.student);
        set_classes(data.classes);
      })
      .catch((err: Error) => set_error(err.message));
  }, [params.id]);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    if (!student) {
      return;
    }
    set_loading(true);
    set_error("");
    try {
      const result = await api<{ student: Student }>(
        `/api/students/${student.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(student),
        },
      );
      set_student(result.student);
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not update.");
    } finally {
      set_loading(false);
    }
  }

  async function on_delete() {
    if (!student || !confirm("Remove this student record?")) {
      return;
    }
    await api(`/api/students/${student.id}`, { method: "DELETE" });
    router.push("/students");
  }

  if (!student && !error) {
    return <p className="text-muted">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title={student?.full_name || "Student"}
        description={student ? `${student.code} · Child Care Home record` : ""}
      />
      <Card className="max-w-3xl">
        {student ? (
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={on_submit}>
            <div className="sm:col-span-2">
              <ErrorText message={error} />
            </div>
            <Field label="Full name">
              <TextInput
                value={student.full_name}
                onChange={(e) =>
                  set_student({ ...student, full_name: e.target.value })
                }
              />
            </Field>
            <Field label="Status">
              <SelectInput
                value={student.status}
                onChange={(e) =>
                  set_student({
                    ...student,
                    status: e.target.value as Student["status"],
                  })
                }
              >
                <option value="active">Active</option>
                <option value="alumni">Alumni</option>
                <option value="left">Left</option>
              </SelectInput>
            </Field>
            <Field label="Date of birth">
              <TextInput
                type="date"
                value={student.date_of_birth}
                onChange={(e) =>
                  set_student({ ...student, date_of_birth: e.target.value })
                }
              />
            </Field>
            <Field label="Class">
              <SelectInput
                value={student.class_id ?? ""}
                onChange={(e) =>
                  set_student({
                    ...student,
                    class_id: e.target.value || null,
                  })
                }
              >
                <option value="">Unassigned</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.grade} · {item.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Guardian">
              <TextInput
                value={student.guardian_name}
                onChange={(e) =>
                  set_student({ ...student, guardian_name: e.target.value })
                }
              />
            </Field>
            <Field label="Guardian phone">
              <TextInput
                value={student.guardian_phone}
                onChange={(e) =>
                  set_student({ ...student, guardian_phone: e.target.value })
                }
              />
            </Field>
            <Field label="Address">
              <TextInput
                value={student.address}
                onChange={(e) =>
                  set_student({ ...student, address: e.target.value })
                }
              />
            </Field>
            <Field label="Gender">
              <SelectInput
                value={student.gender}
                onChange={(e) =>
                  set_student({
                    ...student,
                    gender: e.target.value as Student["gender"],
                  })
                }
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </SelectInput>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <TextArea
                  value={student.notes}
                  onChange={(e) =>
                    set_student({ ...student, notes: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="flex gap-3 sm:col-span-2">
              <PrimaryButton disabled={loading}>
                {loading ? "Saving…" : "Save changes"}
              </PrimaryButton>
              <GhostButton type="button" onClick={on_delete}>
                Remove
              </GhostButton>
            </div>
          </form>
        ) : (
          <ErrorText message={error} />
        )}
      </Card>
    </div>
  );
}
