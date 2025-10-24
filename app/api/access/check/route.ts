import { NextRequest, NextResponse } from 'next/server';
import { checkUserAccess } from '@/lib/access-control';

/**
 * Client-side Access Check API Route
 * 
 * This route allows client components to check user access levels.
 * It's a lightweight endpoint that returns the user's access status.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check user access level
    const accessResult = await checkUserAccess(companyId);
    
    return NextResponse.json({
      hasAccess: accessResult.hasAccess,
      accessLevel: accessResult.accessLevel,
      userId: accessResult.userId,
      error: accessResult.error
    });

  } catch (error) {
    console.error('Access check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
