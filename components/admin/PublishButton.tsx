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
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving experience...');
      const experienceId = await saveExperience('My Onboarding Experience');
      console.log('Save result:', experienceId);
      if (experienceId) {
        alert('Experience saved successfully!');
      } else {
        alert('Failed to save experience. Check console for details.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save experience. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentExperienceId) {
      // First save the experience
      console.log('No experience ID, saving first...');
      setIsSaving(true);
      const experienceId = await saveExperience('My Onboarding Experience');
      setIsSaving(false);
      
      if (!experienceId) {
        alert('Failed to save experience. Please save first, then publish.');
        return;
      }
    }

    setIsPublishing(true);
    try {
      const expId = currentExperienceId || (await saveExperience('My Onboarding Experience'));
      if (!expId) {
        alert('Failed to save experience. Check console for details.');
        return;
      }
      
      console.log('Publishing experience:', expId);
      const success = await publishExperience(expId);
      console.log('Publish result:', success);
      if (success) {
        alert('Experience published successfully! Users can now see your changes.');
      } else {
        alert('Failed to publish experience. Check console for details.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish experience. Check console for details.');
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
        onClick={handleSave}
        disabled={isLoading || isSaving || isPublishing}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isLoading || isSaving || isPublishing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        )}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
      
      <button
        onClick={handlePublish}
        disabled={isLoading || isSaving || isPublishing}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isLoading || isSaving || isPublishing
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
