import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./components/constants/routes";

// Define auth routes that should be accessible without authentication
const AUTH_ROUTES = [
  ROUTES.auth.welcome,
  ROUTES.auth.signin,
  ROUTES.auth.signup,
  ROUTES.auth.emailVerification,
  ROUTES.auth.forgot,
  ROUTES.auth.reset,
  ROUTES.auth.verify,
] as const;

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  ROUTES.public.home,
  ROUTES.public.digiMarket.all,
  ROUTES.public.digiMarket.books,
  ROUTES.public.digiMarket.photos,
  ROUTES.public.digiMarket.videos,
  ROUTES.public.globalRanking,
] as const;

// Helper function to gather all private routes
const gatherPrivateRoutes = (routesObj: any, parentPath = ""): string[] => {
  let privateRoutes: string[] = [];
  
  for (const key in routesObj) {
    const value = routesObj[key];
    
    if (typeof value === "string") {
      // Skip auth and public routes
      if (!AUTH_ROUTES.includes(value as any) && !PUBLIC_ROUTES.includes(value as any)) {
        privateRoutes.push(value);
      }
    } else if (typeof value === "object") {
      // Recursively gather nested routes
      privateRoutes = privateRoutes.concat(gatherPrivateRoutes(value, parentPath));
    }
  }
  
  return privateRoutes;
};

// Get all private routes
const PRIVATE_ROUTES = gatherPrivateRoutes(ROUTES);

// Simple auth check function
const isAuthenticated = (request: NextRequest): boolean => {
  // Check for accessToken in cookies
  const accessToken = request.cookies.get("accessToken");
  
  return !!accessToken;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/sw.js")
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const authenticated = isAuthenticated(request);

  // Handle public routes
  if (PUBLIC_ROUTES.includes(pathname as any)) {
    return NextResponse.next();
  }

  // Handle auth routes
  if (AUTH_ROUTES.includes(pathname as any)) {
    // If user is already authenticated, redirect to dashboard
    if (authenticated) {
      return NextResponse.redirect(new URL(ROUTES.dashboard.home, request.url));
    }
    // Allow access to auth routes for unauthenticated users
    return NextResponse.next();
  }

  // Handle private routes
  if (PRIVATE_ROUTES.some(route => pathname.startsWith(route))) {
    // If user is not authenticated, redirect to login
    if (!authenticated) {
      return NextResponse.redirect(new URL(ROUTES.auth.signin, request.url));
    }
    // Allow access to private routes for authenticated users
    return NextResponse.next();
  }

  // For any other route, redirect to login if not authenticated
  if (!authenticated) {
    return NextResponse.redirect(new URL(ROUTES.auth.signin, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};
