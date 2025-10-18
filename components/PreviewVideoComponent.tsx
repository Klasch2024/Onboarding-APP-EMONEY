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

  // Extract embed URL from iframe HTML if needed
  const getEmbedUrl = (url: string) => {
    console.log('Processing video URL:', url);
    
    // If it's already a clean embed URL, return it
    if (url.includes('youtube.com/embed/') || url.includes('player.vimeo.com/video/')) {
      console.log('Clean embed URL detected');
      return url;
    }
    
    // If it's iframe HTML, extract the src attribute
    const srcMatch = url.match(/src="([^"]+)"/);
    if (srcMatch) {
      console.log('Extracted src from iframe:', srcMatch[1]);
      return srcMatch[1];
    }
    
    // Handle URL-encoded iframe HTML
    const decodedUrl = decodeURIComponent(url);
    const decodedSrcMatch = decodedUrl.match(/src="([^"]+)"/);
    if (decodedSrcMatch) {
      console.log('Extracted src from decoded iframe:', decodedSrcMatch[1]);
      return decodedSrcMatch[1];
    }
    
    // Handle URL-encoded iframe HTML with different encoding
    try {
      const doubleDecodedUrl = decodeURIComponent(decodeURIComponent(url));
      const doubleDecodedSrcMatch = doubleDecodedUrl.match(/src="([^"]+)"/);
      if (doubleDecodedSrcMatch) {
        console.log('Extracted src from double-decoded iframe:', doubleDecodedSrcMatch[1]);
        return doubleDecodedSrcMatch[1];
      }
    } catch (e) {
      console.log('Double decode failed:', e);
    }
    
    // Handle iframe HTML with different quote styles
    const singleQuoteMatch = url.match(/src='([^']+)'/);
    if (singleQuoteMatch) {
      console.log('Extracted src from single-quoted iframe:', singleQuoteMatch[1]);
      return singleQuoteMatch[1];
    }
    
    // If it's a regular YouTube URL, convert to embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.match(/v=([^&]+)/)?.[1];
      if (videoId) {
        console.log('Converted YouTube URL to embed:', `https://www.youtube.com/embed/${videoId}`);
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    console.log('No valid embed URL found, returning original');
    return url;
  };

  const renderVideo = () => {
    if (videoEmbedUrl) {
      // Handle embedded videos (YouTube, Vimeo, etc.)
      const embedUrl = getEmbedUrl(videoEmbedUrl);
      console.log('Final embed URL:', embedUrl);
      
      // Validate that we have a proper embed URL
      if (!embedUrl.startsWith('http')) {
        console.error('Invalid embed URL:', embedUrl);
        return (
          <div className="w-full h-32 border-2 border-dashed border-red-500 rounded-lg flex flex-col items-center justify-center bg-red-500/5">
            <p className="text-red-400 text-sm">Invalid video URL</p>
            <p className="text-red-400 text-xs mt-1">Please use a valid YouTube or Vimeo embed URL</p>
          </div>
        );
      }
      
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
