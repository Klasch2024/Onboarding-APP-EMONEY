import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    // Get token from headers or cookies
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('whop-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return NextResponse.json({
        token: 'Not Found',
        userId: null,
        isAdmin: false,
        accessLevel: 'no_access',
        error: 'No token provided'
      });
    }

    // Verify the user token
    const verification = await whopSdk.verifyUserToken(request.headers);

    if (!verification || !verification.userId) {
      return NextResponse.json({
        token: 'Invalid',
        userId: null,
        isAdmin: false,
        accessLevel: 'no_access',
        error: 'Invalid token'
      });
    }

    const userId = verification.userId;

    // Check admin access
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    let accessLevel = 'no_access';
    let isAdmin = false;

    if (companyId) {
      try {
        const accessCheck = await whopSdk.access.checkIfUserHasAccessToCompany({
          userId,
          companyId
        });
        accessLevel = accessCheck.accessLevel;
        isAdmin = accessCheck.accessLevel === 'admin';
      } catch (error) {
        console.error('Error checking company access:', error);
      }
    }

    return NextResponse.json({
      token: 'Found',
      userId,
      isAdmin,
      accessLevel,
      companyId: companyId || 'Not configured'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      token: 'Error',
      userId: null,
      isAdmin: false,
      accessLevel: 'no_access',
      error: String(error)
    });
  }
}
