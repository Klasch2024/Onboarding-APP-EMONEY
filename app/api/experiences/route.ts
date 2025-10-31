import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId) {
      return NextResponse.json({ error: 'Company not configured' }, { status: 500 });
    }

    const supabase = createServerClient();
    
    // Try to get user, but don't require auth for published experiences
    let userId = null;
    try {
      const userResult = await whopSdk.verifyUserToken(request.headers);
      userId = userResult.userId;
    } catch {
      // User not authenticated - still allow fetching published experiences
    }

    // Get experiences for this company
    // If user is authenticated, show all experiences; otherwise only published ones
    let query = supabase
      .from('onboarding_experiences')
      .select(`
        *,
        onboarding_screens (
          *,
          onboarding_components (*)
        )
      `)
      .eq('company_id', companyId);

    // If not authenticated, only show published experiences
    if (!userId) {
      query = query.eq('is_published', true);
    }

    const { data: experiences, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiences:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch experiences',
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({ experiences: experiences || [] });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase not configured. Missing environment variables.');
      return NextResponse.json({ 
        error: 'Database not configured. Please set up Supabase.', 
        details: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }, { status: 500 });
    }

    // Verify service role key is available for admin operations
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Operations may fail due to RLS policies.');
    }

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

    console.log('Creating experience with:', { name, description, screensCount: screens?.length });

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
      return NextResponse.json({ 
        error: 'Failed to create experience', 
        details: experienceError.message,
        code: experienceError.code,
        hint: experienceError.hint
      }, { status: 500 });
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
            
            const { error: componentError } = await supabase
              .from('onboarding_components')
              .insert({
                screen_id: dbScreen.id,
                type: component.type,
                content: component.content || {},
                settings: component.settings || {},
                order_index: componentIndex
              });

            if (componentError) {
              console.error(`Error creating component ${componentIndex} for screen ${screenIndex}:`, componentError);
              // Continue with other components even if one fails
            }
          }
        }
      }
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
}
