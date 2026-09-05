"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ErrorText, Field, PrimaryButton, TextInput } from "@/components/ui";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_loading(true);
    set_error("");
    try {
      await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      set_loading(false);
    }
  }

  return (
    <AuthShell
      title="Create a staff account"
      subtitle="Join the Al Wasiyo student care workspace. New accounts start as staff."
    >
      <form className="space-y-5" onSubmit={on_submit}>
        <ErrorText message={error} />
        <Field label="Full name">
          <TextInput value={name} onChange={(e) => set_name(e.target.value)} required />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => set_password(e.target.value)}
            required
          />
        </Field>
        <PrimaryButton className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </PrimaryButton>
        <p className="text-sm text-muted">
          Already have access?{" "}
          <Link href="/login" className="font-medium text-forest">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
