import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = await getToken({ req });

  const isAuth = !!token;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up");

  if (!isAuth && req.nextUrl.pathname.startsWith("/workspace")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/workspace", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/sign-in", "/sign-up"],
};
