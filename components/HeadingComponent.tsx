'use client';

import { Component } from '@/lib/types';
import ComponentWrapper from './ComponentWrapper';
import { cn } from '@/lib/utils';

interface HeadingComponentProps {
  component: Component;
  index: number;
}

export default function HeadingComponent({ component, index }: HeadingComponentProps) {
  const { content, settings } = component;
  const text = content.text || 'Heading';

  return (
    <ComponentWrapper component={component} index={index}>
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
    </ComponentWrapper>
  );
}
