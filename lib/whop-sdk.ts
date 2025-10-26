import { WhopServerSdk } from "@whop/api";

/**
 * Whop SDK Configuration
 * 
 * This file configures the Whop SDK for your app. The SDK handles:
 * - User authentication and token verification
 * - Access control (checking if users have access to experiences/companies)
 * - User and company data retrieval
 * - API requests to Whop services
 * 
 * All environment variables are loaded from your .env.local file
 */

// Debug environment variables
console.log('🔍 DEBUG: Environment variables:');
console.log('  - NEXT_PUBLIC_WHOP_APP_ID:', process.env.NEXT_PUBLIC_WHOP_APP_ID ? 'Set' : 'Missing');
console.log('  - WHOP_API_KEY:', process.env.WHOP_API_KEY ? 'Set' : 'Missing');
console.log('  - NEXT_PUBLIC_WHOP_AGENT_USER_ID:', process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID ? 'Set' : 'Missing');
console.log('  - NEXT_PUBLIC_WHOP_COMPANY_ID:', process.env.NEXT_PUBLIC_WHOP_COMPANY_ID ? 'Set' : 'Missing');

export const whopSdk = WhopServerSdk({
	// Your Whop App ID - REQUIRED
	// Get this from your Whop dashboard after creating an app
	// This identifies your app to Whop's servers
	appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "fallback",

	// Your Whop API Key - REQUIRED  
	// Get this from your Whop dashboard under Apps section
	// This authenticates your app with Whop's API
	appApiKey: process.env.WHOP_API_KEY ?? "fallback",

	// Agent User ID - OPTIONAL but recommended
	// This is a Whop user ID that your app can control
	// Most API requests need to be made on behalf of a user
	// You can create a dedicated agent user for your app
	// You can also change this later with the `withUser()` function
	onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,

	// Company ID - OPTIONAL but recommended
	// This is the Whop company ID for your organization
	// Required for company-related API requests
	// You can also change this later with the `withCompany()` function
	companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
});

console.log('✅ DEBUG: Whop SDK initialized:', !!whopSdk);
