import { NextRequest, NextResponse } from 'next/server';
import { checkUserPermissions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user ID and company ID from headers
    const userId = request.headers.get('x-whop-user-id') || 
                   request.headers.get('x-user-id');
    const companyId = request.headers.get('x-whop-company-id') || 
                      request.headers.get('x-company-id');
    
    if (!userId || !companyId) {
      return NextResponse.json({ 
        isAdmin: false, 
        isMember: false,
        accessLevel: null,
        error: 'No user or company ID provided' 
      }, { status: 401 });
    }
    
    // Check user permissions using Whop SDK
    const permissions = await checkUserPermissions(userId, companyId);
    
    return NextResponse.json({ 
      isAdmin: permissions.isAdmin,
      isMember: permissions.isMember,
      accessLevel: permissions.accessLevel,
      user: permissions.user,
      company: permissions.company
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      isMember: false,
      accessLevel: null,
      error: 'Authentication failed' 
    }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, companyId } = body;
    
    if (!userId || !companyId) {
      return NextResponse.json({ 
        isAdmin: false, 
        isMember: false,
        accessLevel: null,
        error: 'User ID and Company ID are required' 
      }, { status: 400 });
    }
    
    // Check user permissions using Whop SDK
    const permissions = await checkUserPermissions(userId, companyId);
    
    return NextResponse.json({ 
      isAdmin: permissions.isAdmin,
      isMember: permissions.isMember,
      accessLevel: permissions.accessLevel,
      user: permissions.user,
      company: permissions.company
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      isMember: false,
      accessLevel: null,
      error: 'Authentication failed' 
    }, { status: 401 });
  }
}
