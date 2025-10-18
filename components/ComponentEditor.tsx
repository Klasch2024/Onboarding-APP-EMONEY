'use client';

import { useOnboardingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { X, AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

export default function ComponentEditor() {
  const { 
    getSelectedComponent, 
    updateComponent, 
    deleteComponent, 
    selectComponent 
  } = useOnboardingStore();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const component = getSelectedComponent();
  
  if (!component) return null;

  const handleUpdateContent = (field: string, value: any) => {
    updateComponent(component.id, {
      content: { ...component.content, [field]: value }
    });
  };

  const handleUpdateSettings = (field: string, value: any) => {
    updateComponent(component.id, {
      settings: { ...component.settings, [field]: value }
    });
  };

  const handleDelete = () => {
    deleteComponent(component.id);
    setShowDeleteConfirm(false);
  };

  const renderEditor = () => {
    switch (component.type) {
      case 'heading':
      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Text</label>
              <textarea
                value={component.content.text || ''}
                onChange={(e) => handleUpdateContent('text', e.target.value)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#888888] focus:border-[#4a7fff] focus:outline-none"
                rows={3}
                placeholder="Enter your text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Alignment</label>
              <div className="flex space-x-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleUpdateSettings('alignment', value)}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      component.settings.alignment === value
                        ? 'bg-[#4a7fff] border-[#4a7fff] text-white'
                        : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#888888] hover:border-[#4a7fff]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Upload Image</label>
              <ImageUpload 
                currentImageUrl={component.content.imageUrl}
                onImageUpload={(imageUrl) => handleUpdateContent('imageUrl', imageUrl)}
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            {/* Video Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Video Type</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Clear embed URL when switching to upload
                    if (component.content.videoEmbedUrl) {
                      handleUpdateContent('videoEmbedUrl', '');
                    }
                  }}
                  className={cn(
                    'px-3 py-2 rounded-lg border transition-colors text-sm',
                    !component.content.videoEmbedUrl
                      ? 'bg-[#4a7fff] border-[#4a7fff] text-white'
                      : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#888888] hover:border-[#4a7fff]'
                  )}
                >
                  Upload Video
                </button>
                <button
                  onClick={() => {
                    // Clear upload URL when switching to embed
                    if (component.content.videoUrl) {
                      handleUpdateContent('videoUrl', '');
                    }
                  }}
                  className={cn(
                    'px-3 py-2 rounded-lg border transition-colors text-sm',
                    component.content.videoEmbedUrl
                      ? 'bg-[#4a7fff] border-[#4a7fff] text-white'
                      : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#888888] hover:border-[#4a7fff]'
                  )}
                >
                  Embed Video
                </button>
              </div>
            </div>

            {/* Upload Video Option */}
            {!component.content.videoEmbedUrl && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Upload Video</label>
                <ImageUpload 
                  currentImageUrl={component.content.videoUrl}
                  onImageUpload={(videoUrl) => handleUpdateContent('videoUrl', videoUrl)}
                  accept="video/*"
                  label="Upload video"
                />
              </div>
            )}

            {/* Embed Video Option */}
            {component.content.videoEmbedUrl && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Embed Video URL</label>
                <input
                  type="url"
                  value={component.content.videoEmbedUrl || ''}
                  onChange={(e) => handleUpdateContent('videoEmbedUrl', e.target.value)}
                  className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#888888] focus:border-[#4a7fff] focus:outline-none"
                  placeholder="https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID"
                />
                <p className="text-xs text-[#888888] mt-1">
                  Paste the embed URL from YouTube, Vimeo, or other video platforms
                </p>
              </div>
            )}

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.settings.autoplay || false}
                  onChange={(e) => handleUpdateSettings('autoplay', e.target.checked)}
                  className="w-4 h-4 text-[#4a7fff] bg-[#2a2a2a] border-[#3a3a3a] rounded focus:ring-[#4a7fff]"
                />
                <span className="text-sm text-white">Enable Autoplay</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Alignment</label>
              <div className="flex space-x-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleUpdateSettings('alignment', value)}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      component.settings.alignment === value
                        ? 'bg-[#4a7fff] border-[#4a7fff] text-white'
                        : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#888888] hover:border-[#4a7fff]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gif':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Upload GIF</label>
              <ImageUpload 
                currentImageUrl={component.content.gifUrl}
                onImageUpload={(gifUrl) => handleUpdateContent('gifUrl', gifUrl)}
                accept="image/gif"
                label="Upload GIF"
              />
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Button Text</label>
              <input
                type="text"
                value={component.content.buttonText || ''}
                onChange={(e) => handleUpdateContent('buttonText', e.target.value)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#888888] focus:border-[#4a7fff] focus:outline-none"
                placeholder="Enter button text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Link URL</label>
              <input
                type="url"
                value={component.content.linkUrl || ''}
                onChange={(e) => handleUpdateContent('linkUrl', e.target.value)}
                className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#888888] focus:border-[#4a7fff] focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Alignment</label>
              <div className="flex space-x-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleUpdateSettings('alignment', value)}
                    className={cn(
                      'p-2 rounded-lg border transition-colors',
                      component.settings.alignment === value
                        ? 'bg-[#4a7fff] border-[#4a7fff] text-white'
                        : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#888888] hover:border-[#4a7fff]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-[#111111] border-l border-[#2a2a2a] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white capitalize">
          {component.type}
        </h3>
        <button
          onClick={() => selectComponent(null)}
          className="text-[#888888] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderEditor()}
      </div>

      {/* Delete Button */}
      <div className="p-6 border-t border-[#2a2a2a]">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#ff4444] hover:bg-[#ff5555] text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Component</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Component</h3>
            <p className="text-[#888888] mb-4">
              Are you sure you want to delete this component? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-[#ff4444] hover:bg-[#ff5555] text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
