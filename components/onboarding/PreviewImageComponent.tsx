'use client';

import { Component } from '@/lib/shared/types';
import { Image as ImageIcon } from 'lucide-react';

interface PreviewImageComponentProps {
  component: Component;
}

export default function PreviewImageComponent({ component }: PreviewImageComponentProps) {
  const { content } = component;
  const imageUrl = content.imageUrl;

  return (
    <>
      {imageUrl ? (
        <div className="w-full flex justify-center">
          <img 
            src={imageUrl} 
            alt="Uploaded content" 
            className="h-auto rounded-lg"
            style={{ maxWidth: '100%' }}
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed border-[#4a7fff] rounded-lg flex flex-col items-center justify-center bg-[#4a7fff]/5">
          <ImageIcon className="w-8 h-8 text-[#4a7fff] mb-2" />
          <p className="text-[#888888] text-sm">No image selected</p>
        </div>
      )}
    </>
  );
}
