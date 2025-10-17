'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, Video, Smile } from 'lucide-react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  accept?: string;
  label?: string;
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageUpload, 
  accept = "image/*",
  label = "Upload image"
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = accept.split(',').map(type => type.trim());
    const isValidType = validTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category);
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert(`Please select a valid file type. Accepted types: ${accept}`);
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    // Convert file to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }, [accept, onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload('');
  }, [onImageUpload]);

  const getIcon = () => {
    if (accept.includes('video')) return Video;
    if (accept.includes('gif')) return Smile;
    return ImageIcon;
  };

  const IconComponent = getIcon();

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-[#4a7fff] bg-[#4a7fff]/10'
            : 'border-[#4a7fff] hover:border-[#5a8fff] hover:bg-[#4a7fff]/5',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {currentImageUrl ? (
          <div className="relative">
            <img
              src={currentImageUrl}
              alt="Uploaded content"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-[#4a7fff] border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconComponent className="w-8 h-8 text-[#4a7fff]" />
            )}
            <div>
              <div className="text-[#888888] mb-1">
                {isUploading ? 'Uploading...' : label}
              </div>
              <div className="text-sm text-[#888888]">
                Drag and drop, or click to select
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File info */}
      {currentImageUrl && (
        <div className="text-xs text-[#888888] text-center">
          File uploaded successfully
        </div>
      )}
    </div>
  );
}
