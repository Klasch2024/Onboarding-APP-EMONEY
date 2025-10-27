'use client';

import { Component } from '@/lib/shared/types';
import { cn } from '@/lib/shared/utils';

interface PreviewParagraphComponentProps {
  component: Component;
}

export default function PreviewParagraphComponent({ component }: PreviewParagraphComponentProps) {
  const { content, settings } = component;
  const text = content.text || 'Add your text here...';

  return (
    <p 
      className={cn(
        'text-white leading-relaxed',
        settings.alignment === 'center' && 'text-center',
        settings.alignment === 'right' && 'text-right'
      )}
    >
      {text}
    </p>
  );
}
