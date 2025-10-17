'use client';

import { Component } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface PreviewContinueButtonComponentProps {
  component: Component;
  onContinue: () => void;
}

export default function PreviewContinueButtonComponent({ component, onContinue }: PreviewContinueButtonComponentProps) {
  const { content, settings } = component;
  const buttonText = content.text || 'Continue';

  const buttonSize = settings.size === 'small' ? 'px-4 py-2 text-sm' :
                    settings.size === 'large' ? 'px-8 py-4 text-lg' :
                    'px-6 py-3 text-base';

  return (
    <div className={cn(
      'w-full',
      settings.alignment === 'center' && 'flex justify-center',
      settings.alignment === 'right' && 'flex justify-end'
    )}>
      <button
        className={cn(
          'bg-[#4a7fff] hover:bg-[#5a8fff] text-white rounded-lg font-medium transition-colors flex items-center space-x-2',
          buttonSize
        )}
        onClick={onContinue}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
