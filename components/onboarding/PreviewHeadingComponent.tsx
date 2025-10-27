'use client';

import { Component } from '@/lib/shared/types';
import { cn } from '@/lib/shared/utils';

interface PreviewHeadingComponentProps {
  component: Component;
}

export default function PreviewHeadingComponent({ component }: PreviewHeadingComponentProps) {
  const { content, settings } = component;
  const text = content.text || 'Heading';

  return (
    <h1 
      className={cn(
        'font-bold text-white',
        settings.alignment === 'center' && 'text-center',
        settings.alignment === 'right' && 'text-right'
      )}
      style={{ fontSize: '60px' }}
    >
      {text}
    </h1>
  );
}
