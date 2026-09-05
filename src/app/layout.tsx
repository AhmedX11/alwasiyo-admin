import type { Metadata } from "next";
import plus_jakarta from "@/lib/fonts";
import { ORG } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${ORG.short_name} Student Care`,
    template: `%s · ${ORG.short_name}`,
  },
  description: `${ORG.name} — student, teacher, and classroom records for the Child Care Home.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plus_jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
