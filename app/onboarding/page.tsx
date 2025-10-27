export default function OnboardingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-4xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Welcome to Your Onboarding Experience
				</h1>
				{/* Main Description Card */}
				<div className="bg-white rounded-xl p-8 shadow-md text-center mb-16">
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						This is your onboarding page. You can customize this content to show your onboarding experience.
					</p>
					<p className="text-base text-gray-500 max-w-2xl mx-auto mb-2">
						This page is visible to regular users. Admin users will see the full builder interface.
					</p>
				</div>

				{/* Content Cards */}
				<div className="grid md:grid-cols-2 gap-6 mb-10">
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							Get Started
						</h3>
						<p className="text-sm text-gray-600">
							Begin your onboarding journey with our guided experience.
						</p>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-md flex flex-col gap-2">
						<h3 className="font-semibold text-gray-900">
							Learn More
						</h3>
						<p className="text-sm text-gray-600">
							Discover all the features and benefits of our platform.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
