import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all possible token sources
  const authHeader = request.headers.get('authorization');
  const whopToken = request.headers.get('x-whop-user-token');
  const cookieToken = request.cookies.get('whop-token')?.value;
  const whopTokenCookie = request.cookies.get('whop_token')?.value;
  const token = request.cookies.get('token')?.value;
  
  // Get all headers and cookies for debugging
  const allHeaders = Object.fromEntries(request.headers.entries());
  const allCookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]));
  
  return NextResponse.json({
    tokens: {
      authorization: authHeader ? 'Present' : 'Missing',
      'x-whop-user-token': whopToken ? 'Present' : 'Missing',
      'whop-token': cookieToken ? 'Present' : 'Missing',
      'whop_token': whopTokenCookie ? 'Present' : 'Missing',
      'token': token ? 'Present' : 'Missing',
    },
    allHeaders,
    allCookies,
    url: request.url,
    method: request.method,
  });
}
