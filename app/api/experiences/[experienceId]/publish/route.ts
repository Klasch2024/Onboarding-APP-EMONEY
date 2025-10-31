import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ experienceId: string }> }
) {
  try {
    const { experienceId } = await params;
    
    // Get current user and company
    const { userId } = await whopSdk.verifyUserToken(request.headers);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId) {
      return NextResponse.json({ error: 'Company not configured' }, { status: 500 });
    }

    const supabase = createServerClient();

    // Publish the experience
    const { data: experience, error } = await supabase
      .from('onboarding_experiences')
      .update({
        is_published: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing experience:', error);
      return NextResponse.json({ 
        error: 'Failed to publish experience',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
