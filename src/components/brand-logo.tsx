type LogoProps = {
  className?: string;
  mark_class?: string;
};

export function BrandLogo({ className = "", mark_class = "h-10 w-10" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className={mark_class}
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M18 40c6 8 22 8 28 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 38c2-10 8-18 14-22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M32 28c4-1 8 1 10 5M30 22c-4 1-6 5-6 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-[0.18em]">
          ALWASIYO
        </span>
        <span className="block text-[10px] font-medium tracking-[0.22em] opacity-80">
          WELFARE FOUNDATION
        </span>
      </span>
    </div>
  );
}
