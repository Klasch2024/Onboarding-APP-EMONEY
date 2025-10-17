'use client';

import { ComponentType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Type,
  FileText,
  Image,
  Smile,
  Video,
  Link
} from 'lucide-react';

interface ComponentPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: ComponentType['type']) => void;
}

const componentTypes: ComponentType[] = [
  {
    type: 'heading',
    label: 'Heading',
    description: 'Add a title or heading to your screen',
    icon: 'Type'
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'Add text content to your screen',
    icon: 'FileText'
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Add an image to your screen',
    icon: 'Image'
  },
  {
    type: 'gif',
    label: 'GIF',
    description: 'Add an animated GIF to your screen',
    icon: 'Smile'
  },
  {
    type: 'video',
    label: 'Video',
    description: 'Add a video to your screen',
    icon: 'Video'
  },
  {
    type: 'link',
    label: 'Link Button',
    description: 'Add a clickable button with a link',
    icon: 'Link'
  }
];

const iconMap = {
  Type,
  FileText,
  Image,
  Smile,
  Video,
  Link
};

export default function ComponentPicker({ 
  isOpen, 
  onClose, 
  onSelectComponent 
}: ComponentPickerProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-6 max-w-2xl mx-4 w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Add a Component</h2>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {componentTypes.map((component, index) => {
            const IconComponent = iconMap[component.icon as keyof typeof iconMap];
            
            return (
              <motion.button
                key={component.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onSelectComponent(component.type);
                  onClose();
                }}
                className="group p-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#2a2a2a] hover:border-[#4a7fff] rounded-lg transition-all duration-200 text-left"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <motion.div 
                    className="w-12 h-12 bg-[#4a7fff]/10 group-hover:bg-[#4a7fff]/20 rounded-lg flex items-center justify-center transition-colors"
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className="w-6 h-6 text-[#4a7fff]" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-[#4a7fff] transition-colors">
                      {component.label}
                    </h3>
                    <p className="text-sm text-[#888888] mt-1">
                      {component.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
