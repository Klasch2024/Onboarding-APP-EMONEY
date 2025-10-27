'use client';

import { Component } from '@/lib/shared/types';
import { cn } from '@/lib/shared/utils';

interface PreviewLinkComponentProps {
  component: Component;
}

export default function PreviewLinkComponent({ component }: PreviewLinkComponentProps) {
  const { content, settings } = component;
  const buttonText = content.buttonText || 'Button Text';
  const linkUrl = content.linkUrl || 'https://example.com';

  const buttonSize = settings.size === 'small' ? 'px-4 py-2 text-sm' :
                    settings.size === 'large' ? 'px-8 py-4 text-lg' :
                    'px-6 py-3 text-base';

  return (
    <div className={cn(
      'w-full',
      settings.alignment === 'center' && 'flex justify-center',
      settings.alignment === 'right' && 'flex justify-end'
    )}>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-block bg-[#4a7fff] hover:bg-[#5a8fff] text-white font-medium rounded-lg transition-colors',
          buttonSize
        )}
      >
        {buttonText}
      </a>
    </div>
  );
}
