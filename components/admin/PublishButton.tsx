'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/admin/store';

export default function PublishButton() {
  const { 
    currentExperienceId, 
    isDirty, 
    isLoading, 
    saveExperience, 
    publishExperience 
  } = useOnboardingStore();
  
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!currentExperienceId) {
      // First save the experience
      const experienceId = await saveExperience('My Onboarding Experience');
      if (!experienceId) {
        alert('Failed to save experience');
        return;
      }
    }

    setIsPublishing(true);
    try {
      const success = await publishExperience(currentExperienceId!);
      if (success) {
        alert('Experience published successfully! Users can now see your changes.');
      } else {
        alert('Failed to publish experience');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish experience');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isDirty && (
        <span className="text-xs text-yellow-400">Unsaved changes</span>
      )}
      
      <button
        onClick={handlePublish}
        disabled={isLoading || isPublishing}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isLoading || isPublishing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        )}
      >
        {isPublishing ? 'Publishing...' : 'Publish'}
      </button>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
