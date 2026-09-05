import { ORG } from "@/lib/constants";
import { BrandLogo } from "@/components/brand-logo";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-forest-deep text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,165,74,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(20,92,59,0.55),transparent_40%)]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden lg:block">
          <BrandLogo className="text-gold" mark_class="h-12 w-12" />
          <p className="mt-10 text-sm uppercase tracking-[0.28em] text-gold">
            Making a difference since {ORG.since}
          </p>
          <h1 className="mt-4 max-w-lg text-5xl font-semibold leading-tight text-white">
            {ORG.tagline}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-cream/80">
            Student care records for Al Wasiyo Child Care Home — education,
            guardianship, and attendance in one calm workspace.
          </p>
          <p className="mt-10 text-sm text-cream/60">
            {ORG.address} · {ORG.phones[0]}
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white p-8 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-10">
          <div className="mb-8 lg:hidden">
            <BrandLogo className="text-forest" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
