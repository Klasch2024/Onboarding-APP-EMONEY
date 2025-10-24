import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 text-lg mb-6">
            You don't have permission to access this area. This section is restricted to administrators only.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/experiences" 
            className="inline-block bg-[#4a7fff] text-white px-8 py-3 rounded-lg hover:bg-[#3a6bcc] transition-colors font-medium"
          >
            Go to Onboarding
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Need admin access? Contact your organization administrator.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
