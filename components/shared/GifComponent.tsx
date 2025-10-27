'use client';

import { Component } from '@/lib/shared/types';
import ComponentWrapper from '../admin/ComponentWrapper';
import { cn } from '@/lib/shared/utils';
import { Smile } from 'lucide-react';

interface GifComponentProps {
  component: Component;
  index: number;
}

export default function GifComponent({ component, index }: GifComponentProps) {
  const { content } = component;
  const gifUrl = content.gifUrl;

  return (
    <ComponentWrapper component={component} index={index}>
      {gifUrl ? (
        <div className="w-full flex justify-center">
          <img 
            src={gifUrl} 
            alt="Animated GIF" 
            className="h-auto rounded-lg"
            style={{ maxWidth: '100%' }}
            onError={(e) => {
              // Fallback if GIF fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed border-[#4a7fff] rounded-lg flex flex-col items-center justify-center bg-[#4a7fff]/5">
          <Smile className="w-8 h-8 text-[#4a7fff] mb-2" />
          <p className="text-[#888888] text-sm">No GIF selected</p>
        </div>
      )}
    </ComponentWrapper>
  );
}
