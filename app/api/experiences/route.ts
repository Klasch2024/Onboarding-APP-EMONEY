import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function GET(request: NextRequest) {
  try {
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
    
    // Get experiences for this company
    const { data: experiences, error } = await supabase
      .from('onboarding_experiences')
      .select(`
        *,
        onboarding_screens (
          *,
          onboarding_components (*)
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiences:', error);
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
    }

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user and company
    const { userId } = await whopSdk.verifyUserToken(request.headers);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId) {
      return NextResponse.json({ error: 'Company not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { name, description, screens } = body;

    const supabase = createServerClient();

    // Create the experience
    const { data: experience, error: experienceError } = await supabase
      .from('onboarding_experiences')
      .insert({
        company_id: companyId,
        name,
        description,
        created_by: userId,
        is_published: false
      })
      .select()
      .single();

    if (experienceError) {
      console.error('Error creating experience:', experienceError);
      return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
    }

    // Create screens and components
    if (screens && screens.length > 0) {
      for (let screenIndex = 0; screenIndex < screens.length; screenIndex++) {
        const screen = screens[screenIndex];
        
        const { data: dbScreen, error: screenError } = await supabase
          .from('onboarding_screens')
          .insert({
            experience_id: experience.id,
            name: screen.name,
            order_index: screenIndex
          })
          .select()
          .single();

        if (screenError) {
          console.error('Error creating screen:', screenError);
          continue;
        }

        // Create components for this screen
        if (screen.components && screen.components.length > 0) {
          for (let componentIndex = 0; componentIndex < screen.components.length; componentIndex++) {
            const component = screen.components[componentIndex];
            
            await supabase
              .from('onboarding_components')
              .insert({
                screen_id: dbScreen.id,
                type: component.type,
                content: component.content,
                settings: component.settings,
                order_index: componentIndex
              });
          }
        }
      }
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
