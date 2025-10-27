import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/shared/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        token: 'Not Found',
        userId: null,
        isAdmin: false,
        accessLevel: 'no_access',
        error: 'No user found'
      });
    }

    return NextResponse.json({
      token: 'Found',
      userId: user.userId,
      isAdmin: user.isAdmin,
      accessLevel: user.accessLevel,
      error: null
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
