// src/proxy.js
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

// ✅ Next.js looks for an export named "proxy" inside proxy.js
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If the user is NOT logged in, redirect them to the landing page
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If logged in, let them proceed smoothly!
  return NextResponse.next();
}

// Protected routing configurations
export const config = {
  matcher: [
    '/rooms/:path*',
    '/add-room', 
    '/my-listings', 
    '/my-bookings'
  ]
};