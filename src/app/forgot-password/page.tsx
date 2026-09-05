"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ErrorText, Field, PrimaryButton, TextInput } from "@/components/ui";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, set_email] = useState("");
  const [error, set_error] = useState("");
  const [reset_url, set_reset_url] = useState("");
  const [message, set_message] = useState("");
  const [loading, set_loading] = useState(false);

  async function on_submit(event: FormEvent) {
    event.preventDefault();
    set_loading(true);
    set_error("");
    set_reset_url("");
    try {
      const result = await api<{ message: string; reset_url: string | null }>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        },
      );
      set_message(result.message);
      set_reset_url(result.reset_url || "");
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Could not start reset.");
    } finally {
      set_loading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your staff account. This demo shows the reset link instead of sending email."
    >
      <form className="space-y-5" onSubmit={on_submit}>
        <ErrorText message={error} />
        <Field label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            required
          />
        </Field>
        <PrimaryButton className="w-full" disabled={loading}>
          {loading ? "Sending…" : "Create reset link"}
        </PrimaryButton>
        {message ? (
          <div className="rounded-2xl bg-cream p-4 text-sm leading-6 text-ink">
            <p>{message}</p>
            {reset_url ? (
              <Link href={reset_url} className="mt-3 block break-all font-medium text-forest">
                {reset_url}
              </Link>
            ) : null}
          </div>
        ) : null}
        <Link href="/login" className="block text-sm text-muted hover:text-ink">
          Back to sign in
        </Link>
      </form>
    </AuthShell>
  );
}
