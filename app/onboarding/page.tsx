'use client';

import { useOnboardingStore } from '@/lib/store';
import { useUserRole } from '@/hooks/useUserRole';
import PreviewHeadingComponent from '@/components/PreviewHeadingComponent';
import PreviewParagraphComponent from '@/components/PreviewParagraphComponent';
import PreviewImageComponent from '@/components/PreviewImageComponent';
import PreviewVideoComponent from '@/components/PreviewVideoComponent';
import PreviewGifComponent from '@/components/PreviewGifComponent';
import PreviewLinkComponent from '@/components/PreviewLinkComponent';
import PreviewContinueButtonComponent from '@/components/PreviewContinueButtonComponent';
import { useState } from 'react';

export default function PublicOnboarding() {
  const { publishedOnboarding } = useOnboardingStore();
  const { user } = useUserRole();
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  // If no published onboarding, show message
  if (!publishedOnboarding || publishedOnboarding.screens.length === 0) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 border-2 border-[#4a7fff] rounded-lg flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-[#4a7fff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Welcome to the Community!
          </h1>
          <p className="text-[#888888] mb-6">
            The onboarding process is being prepared by our admins. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const currentScreen = publishedOnboarding.screens[currentScreenIndex];
  const isLastScreen = currentScreenIndex === publishedOnboarding.screens.length - 1;

  const handleContinue = () => {
    if (!isLastScreen) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
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
      case 'continueButton':
        return (
          <PreviewContinueButtonComponent
            key={component.id}
            component={component}
            onContinue={handleContinue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Community Onboarding</h1>
            <p className="text-sm text-[#888888]">
              Step {currentScreenIndex + 1} of {publishedOnboarding.screens.length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-12">
          {currentScreen.components.map((component) => (
            <div key={component.id}>
              {renderComponent(component)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {publishedOnboarding.screens.length > 1 && (
        <div className="bg-[#111111] border-t border-[#2a2a2a] p-6">
          <div className="max-w-4xl mx-auto flex justify-center space-x-4">
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

            {isLastScreen && (
              <div className="text-center">
                <p className="text-[#888888] mb-4">You've completed the onboarding!</p>
                <button
                  onClick={() => {
                    // Redirect to community or dashboard
                    window.location.href = '/dashboard';
                  }}
                  className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white rounded-lg font-medium transition-colors px-6 py-3"
                >
                  Enter Community
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
