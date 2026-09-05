import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ORG } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-forest-deep text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,165,74,0.16),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_24%)]" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <BrandLogo className="text-gold" />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-cream/80 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-forest-deep"
          >
            Create account
          </Link>
        </div>
      </header>
      <main className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-gold/40 px-4 py-1 text-xs uppercase tracking-[0.22em] text-gold">
            Making a difference since {ORG.since}
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.1] sm:text-6xl">
            {ORG.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cream/75">
            A modern student care system for {ORG.name}. Track children,
            teachers, classes, and daily attendance for the Child Care Home —
            quietly, clearly, and with dignity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest-deep"
            >
              Open staff portal
            </Link>
            <a
              href={ORG.website}
              className="rounded-full border border-gold/70 px-6 py-3 text-sm font-semibold text-white"
            >
              Visit alwasiyo.org
            </a>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Campus notes</p>
          <ul className="mt-6 space-y-5 text-sm leading-6 text-cream/80">
            <li>
              <strong className="block text-white">Child Care Home</strong>
              Safe housing, schooling, and character building for orphaned and
              deserving children.
            </li>
            <li>
              <strong className="block text-white">Education first</strong>
              Classes, teachers, and attendance stay in one place so every child
              is seen.
            </li>
            <li>
              <strong className="block text-white">{ORG.address}</strong>
              {ORG.email} · {ORG.phones.join(" · ")}
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
