import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/shared/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'No user found',
        token: 'Not Found',
        isAdmin: false,
        accessLevel: 'no_access'
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.userId,
      isAdmin: user.isAdmin,
      accessLevel: user.accessLevel,
      token: 'Found',
      message: 'User authenticated'
    });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Authentication error',
      token: 'Error',
      isAdmin: false,
      accessLevel: 'no_access',
      error: String(error)
    });
  }
}
