'use client';

import { Component } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Video as VideoIcon } from 'lucide-react';

interface PreviewVideoComponentProps {
  component: Component;
}

export default function PreviewVideoComponent({ component }: PreviewVideoComponentProps) {
  const { content, settings } = component;
  const videoUrl = content.videoUrl;
  const videoEmbedUrl = content.videoEmbedUrl;

  const renderVideo = () => {
    if (videoEmbedUrl) {
      // Handle embedded videos (YouTube, Vimeo, etc.)
      return (
        <div className="w-full">
          <iframe
            src={videoEmbedUrl}
            className="w-full rounded-lg"
            style={{ height: '400px', maxWidth: '100%' }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      );
    } else if (videoUrl) {
      // Handle uploaded videos
      return (
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
      );
    }
    return null;
  };

  return (
    <>
      {videoUrl || videoEmbedUrl ? (
        <div className={cn(
          'w-full flex justify-center',
          settings.alignment === 'left' && 'justify-start',
          settings.alignment === 'right' && 'justify-end'
        )}>
          {renderVideo()}
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed border-[#4a7fff] rounded-lg flex flex-col items-center justify-center bg-[#4a7fff]/5">
          <VideoIcon className="w-8 h-8 text-[#4a7fff] mb-2" />
          <p className="text-[#888888] text-sm">No video selected</p>
        </div>
      )}
    </>
  );
}
