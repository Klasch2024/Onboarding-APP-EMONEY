'use client';

import { useOnboardingStore } from '@/lib/store';
import PreviewHeadingComponent from './PreviewHeadingComponent';
import PreviewParagraphComponent from './PreviewParagraphComponent';
import PreviewImageComponent from './PreviewImageComponent';
import PreviewVideoComponent from './PreviewVideoComponent';
import PreviewGifComponent from './PreviewGifComponent';
import PreviewLinkComponent from './PreviewLinkComponent';

export default function PreviewScreen() {
  const { getCurrentScreen, screens, currentScreenId, selectScreen } = useOnboardingStore();
  const currentScreen = getCurrentScreen();
  const components = currentScreen?.components || [];
  
  const currentScreenIndex = screens.findIndex(screen => screen.id === currentScreenId);
  const isLastScreen = currentScreenIndex === screens.length - 1;

  const handleContinue = () => {
    if (!isLastScreen && currentScreenIndex < screens.length - 1) {
      const nextScreen = screens[currentScreenIndex + 1];
      selectScreen(nextScreen.id);
    }
  };

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      const prevScreen = screens[currentScreenIndex - 1];
      selectScreen(prevScreen.id);
    }
  };

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
    <div className="flex-1 bg-[#111111] flex flex-col">
      {/* Preview Content - Full Width */}
      <div className="flex-1 p-8 overflow-y-auto">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-2 border-[#4a7fff] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#4a7fff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No components yet
            </h3>
            <p className="text-[#888888]">
              Switch to the Builder tab to add components to your onboarding screen.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-12">
            {components.map((component) => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons - Always at bottom */}
      {screens.length > 1 && (
        <div className="bg-[#111111] border-t border-[#2a2a2a] p-6">
          <div className="flex justify-center space-x-4">
            {/* Back Button - Show on all screens except the first */}
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
            
            {/* Continue Button - Show on all screens except the last */}
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
