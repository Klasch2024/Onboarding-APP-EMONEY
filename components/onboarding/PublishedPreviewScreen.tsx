'use client';

import { useState, useEffect } from 'react';
import PreviewHeadingComponent from './PreviewHeadingComponent';
import PreviewParagraphComponent from './PreviewParagraphComponent';
import PreviewImageComponent from './PreviewImageComponent';
import PreviewVideoComponent from './PreviewVideoComponent';
import PreviewGifComponent from './PreviewGifComponent';
import PreviewLinkComponent from './PreviewLinkComponent';

interface PublishedExperience {
  id: string;
  name: string;
  onboarding_screens: Array<{
    id: string;
    name: string;
    order_index: number;
    onboarding_components: Array<{
      id: string;
      type: string;
      content: any;
      settings: any;
      order_index: number;
    }>;
  }>;
}

export default function PublishedPreviewScreen() {
  const [experience, setExperience] = useState<PublishedExperience | null>(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPublishedExperience();
  }, []);

  const loadPublishedExperience = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const { experiences } = await response.json();
        // Find the first published experience
        const publishedExperience = experiences.find((exp: any) => exp.is_published);
        if (publishedExperience) {
          setExperience(publishedExperience);
        }
      }
    } catch (error) {
      console.error('Error loading published experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (experience && currentScreenIndex < experience.onboarding_screens.length - 1) {
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
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a7fff] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading onboarding experience...</p>
        </div>
      </div>
    );
  }

  if (!experience || !experience.onboarding_screens.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Published Experience</h2>
          <p className="text-gray-400">Your admin hasn't published an onboarding experience yet.</p>
        </div>
      </div>
    );
  }

  const currentScreen = experience.onboarding_screens[currentScreenIndex];
  const components = currentScreen?.onboarding_components || [];
  const isLastScreen = currentScreenIndex === experience.onboarding_screens.length - 1;
  const isFirstScreen = currentScreenIndex === 0;

  return (
    <div className="flex flex-col h-full bg-[#111111]">
      {/* Screen Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {components.map((component) => renderComponent(component))}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-[#2a2a2a] p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isFirstScreen}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-all duration-200',
              isFirstScreen
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
            )}
          >
            Back
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Screen {currentScreenIndex + 1} of {experience.onboarding_screens.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">{currentScreen?.name}</p>
          </div>

          <button
            onClick={handleContinue}
            disabled={isLastScreen}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-all duration-200',
              isLastScreen
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-[#4a7fff] text-white hover:bg-[#3a6bff]'
            )}
          >
            {isLastScreen ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
