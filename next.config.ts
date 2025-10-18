import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	output: 'standalone',
	trailingSlash: true,
	// Ensure proper handling of Whop SDK
	experimental: {
		serverComponentsExternalPackages: ['@whop/api', '@whop/react'],
	},
	// Add proper headers for Whop integration
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
				],
			},
		];
	},
};

export default withWhopAppConfig(nextConfig);
