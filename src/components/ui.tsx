import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

const control =
  "w-full rounded-2xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-gold focus:bg-white";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} min-h-28 ${props.className ?? ""}`} />;
}

export const primary_button_class =
  "inline-flex items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest-mid disabled:opacity-60";

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${primary_button_class} ${props.className ?? ""}`}
    />
  );
}

export function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full border border-gold/70 px-5 py-3 text-sm font-semibold text-forest transition hover:bg-gold/10 ${props.className ?? ""}`}
    />
  );
}

export function ErrorText({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-forest-deep">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[24px] border border-cream-dark bg-white p-6 shadow-[0_10px_40px_rgba(10,54,34,0.04)] ${className}`}>
      {children}
    </div>
  );
}
