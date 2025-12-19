import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

// Minimal proxy: enforce auth on API by returning 401 JSON when unsigned.
export default clerkMiddleware((auth, req) => {
  console.log("proxy hit:", req.nextUrl.pathname);
  if (isApiRoute(req)) {
    const { userId } = auth();
    console.log("proxy api userId", userId, "cookie", req.headers.get("cookie"));
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*)",
  ],
};
