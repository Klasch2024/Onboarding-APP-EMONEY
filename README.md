# 🚀 Onboarding App

A beginner-friendly Whop app built with Next.js and the Whop SDK. This template includes everything you need to get started with building Whop applications.

## ✨ What's Included

- **🔐 Authentication**: Built-in Whop SDK authentication
- **👥 User Management**: Access control for experiences and companies
- **📱 Responsive Design**: Modern UI with Tailwind CSS
- **📚 Well Documented**: Extensive comments and beginner-friendly explanations
- **🚀 Ready to Deploy**: Pre-configured for Vercel deployment

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Your Whop App

1. Go to your [Whop Dashboard](https://whop.com/dashboard/developer/)
2. Create a new app in the Developer section
3. In the "Hosting" section, set these paths:
   - **App path**: `/experiences/[experienceId]`
   - **Dashboard path**: `/dashboard/[companyId]`
   - **Discover path**: `/discover`

### 3. Configure Environment Variables

Copy your environment variables from the Whop dashboard into `.env.local`:

```bash
# Copy the template
cp .env.local.example .env.local

# Edit with your actual values
nano .env.local
```

Required variables:
- `WHOP_API_KEY` - Your Whop API key
- `WHOP_WEBHOOK_SECRET` - Your webhook secret
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - Agent user ID
- `NEXT_PUBLIC_WHOP_APP_ID` - Your app ID
- `NEXT_PUBLIC_WHOP_COMPANY_ID` - Your company ID
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (get from Supabase dashboard → Settings → API)

### 4. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema-fixed.sql` in your Supabase SQL Editor
3. Get your Supabase credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API keys → `anon` `public`
   - Service Role Key: Settings → API → Project API keys → `service_role` (keep secret!)
4. Add them to your `.env.local` file

See `SUPABASE_SETUP.md` for detailed instructions.

### 5. Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### 6. Install Your App

1. Go to a Whop in your organization
2. Navigate to the Tools section
3. Add your app
4. Test the integration!

## 📁 Project Structure

```
onboarding-app/
├── app/                          # Next.js app directory
│   ├── dashboard/[companyId]/    # Company dashboard pages
│   ├── experiences/[experienceId]/ # Experience pages
│   ├── discover/                 # Discover page
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout
├── lib/
│   └── whop-sdk.ts              # Whop SDK configuration
├── .env.local                   # Environment variables
└── README.md                    # This file
```

## 🔧 Key Features

### Authentication Flow
- Automatic user token verification
- Access control for experiences and companies
- User information retrieval

### Page Types
- **Experience Pages**: For users accessing through Whop experiences
- **Dashboard Pages**: For company administrators
- **Discover Page**: For app discovery

### SDK Integration
- Pre-configured Whop SDK
- Comprehensive error handling
- Beginner-friendly comments

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add your environment variables
5. Deploy!

### Update Whop Settings

After deployment, update your Whop app settings:
- Set the "Base URL" to your Vercel domain
- Update webhook URLs if needed

## 📚 Learning Resources

- [Whop Documentation](https://dev.whop.com/introduction)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Common Issues

**App not loading?**
- Check that your environment variables are set correctly
- Verify the app paths in your Whop dashboard
- Ensure your app is installed in a Whop

**Authentication errors?**
- Verify your API key and app ID
- Check that the agent user ID is valid
- Ensure your company ID is correct

**Environment variables not working?**
- Make sure you're using `.env.local` (not `.env.development`)
- Restart your development server after changing variables
- Check that all required variables are set

## 🤝 Contributing

This is a template project. Feel free to:
- Fork and customize for your needs
- Add new features
- Improve the documentation
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

---

**Need help?** Check out the [Whop Documentation](https://dev.whop.com) or create an issue in this repository.
