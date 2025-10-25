import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug API Route for Headers and Cookies
 * 
 * This route helps debug what headers and cookies are being sent
 * to help identify the correct token source for Whop integration.
 */
export async function GET(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  const cookies = Object.fromEntries(
    request.cookies.getAll().map(cookie => [cookie.name, cookie.value])
  );
  
  return NextResponse.json({
    headers,
    cookies,
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString()
  });
}
