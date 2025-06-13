/* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
// const token = req.cookies.get("accessToken");

// if (token && req.nextUrl.pathname === "/") {
//   return NextResponse.redirect(new URL("/dashboard", req.url));
// } else if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
//   return NextResponse.redirect(new URL("/", req.url));
// }
// if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
//   return NextResponse.redirect(new URL("/", req.url));
//  }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard/:path*"],
// };
