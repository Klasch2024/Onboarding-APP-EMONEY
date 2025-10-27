'use client';

import { useOnboardingStore } from '@/lib/admin/store';
import { cn } from '@/lib/shared/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentPicker from './ComponentPicker';
import HeadingComponent from '../shared/HeadingComponent';
import ParagraphComponent from '../shared/ParagraphComponent';
import ImageComponent from '../shared/ImageComponent';
import VideoComponent from '../shared/VideoComponent';
import GifComponent from '../shared/GifComponent';
import LinkComponent from '../shared/LinkComponent';

export default function Canvas() {
  const { 
    getCurrentScreen, 
    addComponent, 
    selectedComponentId, 
    selectComponent 
  } = useOnboardingStore();
  
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  
  const currentScreen = getCurrentScreen();
  const components = currentScreen?.components || [];

  const handleAddComponent = (type: any) => {
    addComponent(type);
    setShowComponentPicker(false);
  };

  const renderComponent = (component: any, index: number) => {
    switch (component.type) {
      case 'heading':
        return <HeadingComponent key={component.id} component={component} index={index} />;
      case 'paragraph':
        return <ParagraphComponent key={component.id} component={component} index={index} />;
      case 'image':
        return <ImageComponent key={component.id} component={component} index={index} />;
      case 'video':
        return <VideoComponent key={component.id} component={component} index={index} />;
      case 'gif':
        return <GifComponent key={component.id} component={component} index={index} />;
      case 'link':
        return <LinkComponent key={component.id} component={component} index={index} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-[#111111] flex flex-col">
      {/* Canvas Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {components.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-2 border-[#4a7fff] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#4a7fff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Create your first screen to get started
            </h3>
            <p className="text-[#888888] mb-6">
              Your onboarding components will appear here
            </p>
            <button
              onClick={() => setShowComponentPicker(true)}
              className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Component</span>
            </button>
          </div>
        ) : (
               /* Components List */
               <div className="max-w-2xl mx-auto space-y-12">
                 <AnimatePresence>
                   {components.map((component, index) => (
                     <motion.div
                       key={component.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.2, delay: index * 0.1 }}
                     >
                       {renderComponent(component, index)}
                     </motion.div>
                   ))}
                 </AnimatePresence>
            
            {/* Add Component Button */}
            <motion.div 
              className="flex justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => setShowComponentPicker(true)}
                className="bg-[#4a7fff] hover:bg-[#5a8fff] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Component</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Component Picker Modal */}
      <ComponentPicker
        isOpen={showComponentPicker}
        onClose={() => setShowComponentPicker(false)}
        onSelectComponent={handleAddComponent}
      />
    </div>
  );
}
