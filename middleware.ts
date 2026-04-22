import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/workspace", "/invite"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = req.nextUrl;

  const isAuth = !!token;
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isPrivate = PRIVATE_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isAuth && isPrivate) {
    const signInUrl = new URL("/sign-in", req.url);

    signInUrl.searchParams.set("callbackUrl", pathname + search);

    return NextResponse.redirect(signInUrl);
  }

  if (isAuth && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/invite/:path*", "/sign-in", "/sign-up"],
};
