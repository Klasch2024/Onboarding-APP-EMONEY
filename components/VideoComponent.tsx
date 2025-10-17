'use client';

import { Component } from '@/lib/types';
import ComponentWrapper from './ComponentWrapper';
import { cn } from '@/lib/utils';
import { Video as VideoIcon } from 'lucide-react';

interface VideoComponentProps {
  component: Component;
  index: number;
}

export default function VideoComponent({ component, index }: VideoComponentProps) {
  const { content, settings } = component;
  const videoUrl = content.videoUrl;

  return (
    <ComponentWrapper component={component} index={index}>
      {videoUrl ? (
        <div className={cn(
          'w-full flex justify-center',
          settings.alignment === 'left' && 'justify-start',
          settings.alignment === 'right' && 'justify-end'
        )}>
          <video 
            src={videoUrl} 
            controls
            autoPlay={settings.autoplay}
            className="h-auto rounded-lg"
            style={{ maxWidth: '100%', maxHeight: '400px' }}
            onError={(e) => {
              // Fallback if video fails to load
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed border-[#4a7fff] rounded-lg flex flex-col items-center justify-center bg-[#4a7fff]/5">
          <VideoIcon className="w-8 h-8 text-[#4a7fff] mb-2" />
          <p className="text-[#888888] text-sm">No video selected</p>
        </div>
      )}
    </ComponentWrapper>
  );
}
