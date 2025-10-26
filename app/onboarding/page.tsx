'use client';

import { useOnboardingStore } from '@/lib/store';
import PreviewHeadingComponent from '@/components/PreviewHeadingComponent';
import PreviewParagraphComponent from '@/components/PreviewParagraphComponent';
import PreviewImageComponent from '@/components/PreviewImageComponent';
import PreviewVideoComponent from '@/components/PreviewVideoComponent';
import PreviewGifComponent from '@/components/PreviewGifComponent';
import PreviewLinkComponent from '@/components/PreviewLinkComponent';

export default function OnboardingPage() {
  // Get screens, currentScreenId, and selectScreen from store
  const { getCurrentScreen, screens, currentScreenId, selectScreen } = useOnboardingStore();
  const currentScreen = getCurrentScreen();
  const components = currentScreen?.components || [];
  
  // Calculate current screen index and if it's the last screen
  const currentScreenIndex = screens.findIndex(screen => screen.id === currentScreenId);
  const isLastScreen = currentScreenIndex === screens.length - 1;

  // Implement handleContinue function
  const handleContinue = () => {
    if (!isLastScreen && currentScreenIndex < screens.length - 1) {
      const nextScreen = screens[currentScreenIndex + 1];
      selectScreen(nextScreen.id);
    }
  };

  // Implement handleBack function
  const handleBack = () => {
    if (currentScreenIndex > 0) {
      const prevScreen = screens[currentScreenIndex - 1];
      selectScreen(prevScreen.id);
    }
  };

  // Implement renderComponent function
  const renderComponent = (component: any) => {
    switch (component.type) {
      case 'heading':
        return <PreviewHeadingComponent key={component.id} component={component} />;
      case 'paragraph':
        return <PreviewParagraphComponent key={component.id} component={component} />;
      case 'image':
        return <PreviewImageComponent key={component.id} component={component} />;
      case 'video':
        return <PreviewVideoComponent key={component.id} component={component} />;
      case 'gif':
        return <PreviewGifComponent key={component.id} component={component} />;
      case 'link':
        return <PreviewLinkComponent key={component.id} component={component} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* Onboarding Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {components.length === 0 ? (
          // Empty state - show when no components exist
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-2 border-[#4a7fff] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#4a7fff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Welcome!
            </h3>
            <p className="text-[#888888]">
              Your onboarding experience will appear here.
            </p>
          </div>
        ) : (
          // Render components
          <div className="max-w-2xl mx-auto space-y-12">
            {components.map((component) => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {screens.length > 1 && (
        <div className="bg-[#111111] border-t border-[#2a2a2a] p-6">
          <div className="flex justify-center space-x-4">
            {/* Back Button */}
            {currentScreenIndex > 0 && (
              <button
                onClick={handleBack}
                className="bg-transparent border border-[#3a3a3a] hover:border-[#4a7fff] text-white rounded-lg font-medium transition-colors flex items-center space-x-2 px-6 py-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            )}
            
            {/* Continue Button */}
            {!isLastScreen && (
              <button
                onClick={handleContinue}
                className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white rounded-lg font-medium transition-colors flex items-center space-x-2 px-6 py-3"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
