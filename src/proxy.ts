import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";
import { verify_session_token } from "@/lib/session";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

function is_public(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookie_header = request.headers.get("cookie") ?? "";
  const match = cookie_header.match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`),
  );
  const token = match ? decodeURIComponent(match[1]) : "";
  const user = token ? await verify_session_token(token) : null;

  if (!user && !is_public(pathname)) {
    const login = new URL("/login", url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (user && ["/login", "/signup", "/forgot-password"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
