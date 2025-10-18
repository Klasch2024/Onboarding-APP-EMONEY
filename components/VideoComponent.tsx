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
  const videoEmbedUrl = content.videoEmbedUrl;

  // Extract embed URL from iframe HTML if needed
  const getEmbedUrl = (url: string) => {
    // If it's already a clean embed URL, return it
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
      return url;
    }
    
    // If it's iframe HTML, extract the src attribute
    const srcMatch = url.match(/src="([^"]+)"/);
    if (srcMatch) {
      return srcMatch[1];
    }
    
    // If it's a regular YouTube URL, convert to embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.match(/v=([^&]+)/)?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    return url;
  };

  const renderVideo = () => {
    if (videoEmbedUrl) {
      // Handle embedded videos (YouTube, Vimeo, etc.)
      const embedUrl = getEmbedUrl(videoEmbedUrl);
      return (
        <div className="w-full">
          <iframe
            src={embedUrl}
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
    <ComponentWrapper component={component} index={index}>
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
    </ComponentWrapper>
  );
}
