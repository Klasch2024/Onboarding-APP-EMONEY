import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { whopSdk } from '@/lib/shared/whop-sdk';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ experienceId: string }> }
) {
  try {
    const { experienceId } = await params;
    
    // Get current user (optional for published experiences)
    let userId = null;
    try {
      const userResult = await whopSdk.verifyUserToken(request.headers);
      userId = userResult.userId;
    } catch {
      // User not authenticated, but we can still show published experiences
    }

    const supabase = createServerClient();
    
    // Get the experience with screens and components
    const { data: experience, error } = await supabase
      .from('onboarding_experiences')
      .select(`
        *,
        onboarding_screens (
          *,
          onboarding_components (*)
        )
      `)
      .eq('id', experienceId)
      .single();

    if (error) {
      console.error('Error fetching experience:', error);
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Check if user can view this experience
    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    const isOwner = experience.company_id === companyId;
    const isPublished = experience.is_published;

    if (!isPublished && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ experience });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const { name, description, screens, is_published } = body;

    const supabase = createServerClient();

    // Update the experience
    const { data: experience, error: experienceError } = await supabase
      .from('onboarding_experiences')
      .update({
        name,
        description,
        is_published: is_published || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId)
      .eq('company_id', companyId)
      .select()
      .single();

    if (experienceError) {
      console.error('Error updating experience:', experienceError);
      return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
    }

    // If screens are provided, update them
    if (screens) {
      // Delete existing screens and components
      await supabase
        .from('onboarding_components')
        .delete()
        .in('screen_id', 
          supabase
            .from('onboarding_screens')
            .select('id')
            .eq('experience_id', experienceId)
        );

      await supabase
        .from('onboarding_screens')
        .delete()
        .eq('experience_id', experienceId);

      // Create new screens and components
      for (let screenIndex = 0; screenIndex < screens.length; screenIndex++) {
        const screen = screens[screenIndex];
        
        const { data: dbScreen, error: screenError } = await supabase
          .from('onboarding_screens')
          .insert({
            experience_id: experienceId,
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

export async function DELETE(
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

    // Delete the experience (cascade will handle screens and components)
    const { error } = await supabase
      .from('onboarding_experiences')
      .delete()
      .eq('id', experienceId)
      .eq('company_id', companyId);

    if (error) {
      console.error('Error deleting experience:', error);
      return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
