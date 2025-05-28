import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = [
  {
    path: "/admin",
    roles: ["ADMIN"],
  },
  {
    path: "/user",
    roles: ["USER"],
  },
  {
    pash: "/user/dashboard",
    roles: ["USER"],
  },
  {
    path: "/profile",
    roles: ["USER", "ADMIN"],
  },
  {
    path: "/admin/dashboard",
    roles: ["ADMIN"],
  },
];

// Define public routes that don't need authentication
const publicRoutes = ["/login", "/register", "/", "/movies", "/series"];

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Add debugging logs to trace middleware logic
  console.log("Middleware invoked for path:", pathname);
  console.log("Token:", token);

  // Allow public routes
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/movies") ||
    pathname.startsWith("/series")
  ) {
    return NextResponse.next();
  }

  // Check if path starts with any protected route
  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path as string)
  );

  let userRole: string | null = null;
  if (token) {
    try {
      const encoder = new TextEncoder();
      const secret = encoder.encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      console.log("Payload:", payload);
      userRole = payload.role as string;
    } catch (err) {
      console.log("Invalid or expired token.", err);
      // Redirect to login if token is invalid
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // If it's a protected route
  if (matchedRoute) {
    console.log("Matched protected route:", matchedRoute.path);
    // If no token, redirect to login
    if (!token) {
      console.log("No token found. Redirecting to login.");
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // If no role or invalid role for the route
    if (!userRole || !matchedRoute.roles.includes(userRole)) {
      console.log(
        "Invalid or missing role. Redirecting based on role or to login."
      );
      // Redirect to login if no role
      if (!userRole) {
        console.log("No user role found. Redirecting to login.");
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }

      // Redirect to appropriate dashboard based on role
      console.log(
        "Redirecting to:",
        userRole === "USER" ? "/user/dashboard" : "/admin/dashboard"
      );
      if (userRole === "USER") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      } else if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // Default redirect to homepage if unauthorized
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    console.log("No matching protected route. Proceeding to next.");
  }

  return NextResponse.next();
}

// Configure middleware matching pattern
export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - static files (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/login",
    "/register",
    "/profile",
    "/admin/:path*",
    "/user/:path*",
    "/movies/:path*",
    "/series/:path*",
  ],
};
