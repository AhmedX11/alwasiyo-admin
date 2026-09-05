"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ErrorText, Field, PrimaryButton, TextInput } from "@/components/ui";
import { api } from "@/lib/api";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, set_password] = useState("");
  const [error, set_error] = useState("");
  const [loading, set_loading] = useState(false);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_loading(true);
    set_error("");
    try {
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      router.push("/login");
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      set_loading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={on_submit}>
      <ErrorText message={error} />
      {!token ? (
        <ErrorText message="This reset link is missing a token. Request a new one." />
      ) : null}
      <Field label="New password">
        <TextInput
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => set_password(e.target.value)}
          required
        />
      </Field>
      <PrimaryButton className="w-full" disabled={loading || !token}>
        {loading ? "Updating…" : "Update password"}
      </PrimaryButton>
      <Link href="/login" className="block text-sm text-muted hover:text-ink">
        Back to sign in
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Use at least 8 characters, then sign in again."
    >
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
