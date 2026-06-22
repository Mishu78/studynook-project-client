// src/middleware.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function proxy(request) {
  // Call your backend or Better Auth api directly to verify cookie validation
  const url = new URL(request.url);
  
  // Example: Read your custom httpOnly token cookie or Better Auth session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("token");

  // If the user is NOT logged in and trying to access private routes, redirect to home/login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Protected routing configurations matching assignment rules exactly
export const config = {
  matcher: [
    '/add-room', 
    '/my-listings', 
    '/my-bookings'
  ]
};