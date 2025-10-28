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
export const whopSdk = WhopServerSdk({
	// Your Whop App ID - REQUIRED
	// Get this from your Whop dashboard after creating an app
	// This identifies your app to Whop's servers
	appId: process.env.NEXT_PUBLIC_WHOP_APP_ID ?? "fallback",

	// Your Whop API Key - REQUIRED  
	// Get this from your Whop dashboard under Apps section
	// This authenticates your app with Whop's API
	appApiKey: process.env.WHOP_API_KEY ?? "fallback",

	// Note: Following Whop's new permissions model
	// onBehalfOfUserId and companyId are now handled via withUser() and withCompany() functions
	// This allows for more flexible permission management
});
