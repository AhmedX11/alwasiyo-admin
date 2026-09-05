"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ErrorText, Field, PrimaryButton, TextInput } from "@/components/ui";
import { api } from "@/lib/api";
import { DEMO_ADMIN } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, set_email] = useState(DEMO_ADMIN.email);
  const [password, set_password] = useState(DEMO_ADMIN.password);
  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_loading(true);
    set_error("");
    try {
      await api("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push(params.get("next") || "/dashboard");
      router.refresh();
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      set_loading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={on_submit}>
      <ErrorText message={error} />
      <Field label="Email">
        <TextInput
          type="email"
          value={email}
          onChange={(event) => set_email(event.target.value)}
          required
        />
      </Field>
      <Field label="Password">
        <TextInput
          type="password"
          value={password}
          onChange={(event) => set_password(event.target.value)}
          required
        />
      </Field>
      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-forest-mid hover:underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-muted hover:text-ink">
          Create account
        </Link>
      </div>
      <PrimaryButton className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </PrimaryButton>
      <p className="text-xs leading-5 text-muted">
        Demo staff login is pre-filled: {DEMO_ADMIN.email}
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to the Child Care Home staff portal."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
