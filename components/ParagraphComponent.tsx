'use client';

import { Component } from '@/lib/types';
import ComponentWrapper from './ComponentWrapper';
import { cn } from '@/lib/utils';

interface ParagraphComponentProps {
  component: Component;
  index: number;
}

export default function ParagraphComponent({ component, index }: ParagraphComponentProps) {
  const { content, settings } = component;
  const text = content.text || 'Add your text here...';

  return (
    <ComponentWrapper component={component} index={index}>
      <p 
        className={cn(
          'text-white leading-relaxed',
          settings.alignment === 'center' && 'text-center',
          settings.alignment === 'right' && 'text-right'
        )}
      >
        {text}
      </p>
    </ComponentWrapper>
  );
}
