import { NextRequest, NextResponse } from 'next/server';
import { checkUserAccess } from '@/lib/access-control';

/**
 * Admin API Route for Onboarding Management
 * 
 * This route handles admin-only operations for onboarding content.
 * All requests are protected with role-based access control.
 */

// GET - Fetch onboarding data (admin only)
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

    // Check if user has admin access
    const accessResult = await checkUserAccess(companyId);
    
    if (!accessResult.hasAccess || accessResult.accessLevel !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return onboarding data (this would typically fetch from your database)
    return NextResponse.json({
      success: true,
      data: {
        screens: [],
        components: []
      }
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update onboarding data (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, screens, components } = body;
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check if user has admin access
    const accessResult = await checkUserAccess(companyId);
    
    if (!accessResult.hasAccess || accessResult.accessLevel !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Update onboarding data (this would typically save to your database)
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Onboarding data updated successfully'
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
