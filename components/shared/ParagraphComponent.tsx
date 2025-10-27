'use client';

import { Component } from '@/lib/shared/types';
import ComponentWrapper from '../admin/ComponentWrapper';
import { cn } from '@/lib/shared/utils';

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
