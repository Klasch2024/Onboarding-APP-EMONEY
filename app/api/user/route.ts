import { NextRequest, NextResponse } from 'next/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    // Get token from headers or cookies - Whop uses x-whop-user-token header
    const authHeader = request.headers.get('authorization');
    const whopToken = request.headers.get('x-whop-user-token');
    const cookieToken = request.cookies.get('whop-token')?.value;
    const token = whopToken || authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return NextResponse.json({
        token: 'Not Found',
        userId: null,
        isAdmin: false,
        accessLevel: 'no_access',
        error: 'No token provided'
      });
    }

    // Verify the user token - using same pattern as example
    const { userId } = await whopSdk.verifyUserToken(request.headers);

    if (!userId) {
      return NextResponse.json({
        token: 'Invalid',
        userId: null,
        isAdmin: false,
        accessLevel: 'no_access',
        error: 'Invalid token'
      });
    }

            // Check admin access
            const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
            let accessLevel = 'no_access';
            let isAdmin = false;

            if (companyId) {
              try {
                // Use the new SDK pattern with withUser() and withCompany()
                const accessCheck = await whopSdk
                  .withUser(userId)
                  .withCompany(companyId)
                  .access.checkIfUserHasAccessToCompany({
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
