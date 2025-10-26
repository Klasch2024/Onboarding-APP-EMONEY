import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		console.log('🔍 DEBUG API: Fetching user info...');
		
		const userInfo = await getCurrentUser();
		
		console.log('🔍 DEBUG API: User info result:', userInfo);
		
		return NextResponse.json(userInfo);
	} catch (error) {
		console.error('❌ DEBUG API Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user info', details: error },
			{ status: 500 }
		);
	}
}
