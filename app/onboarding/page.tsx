export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Onboarding</h1>
        <p className="text-xl text-gray-300 mb-8">
          This is the onboarding experience for regular users.
        </p>
        <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-gray-400">
            You are viewing the onboarding page. This is where regular users would see their onboarding experience.
          </p>
        </div>
      </div>
    </div>
  );
}
