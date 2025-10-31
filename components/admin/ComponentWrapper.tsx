'use client';

import { Component } from '@/lib/shared/types';
import { cn } from '@/lib/shared/utils';
import { GripVertical } from 'lucide-react';
import { useOnboardingStore } from '@/lib/admin/store';
import { motion } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { useRef, useEffect } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface ComponentWrapperProps {
  component: Component;
  children: React.ReactNode;
  className?: string;
  index: number;
}

export default function ComponentWrapper({
  component,
  children,
  className,
  index
}: ComponentWrapperProps) {
  const { selectedComponentId, selectComponent, reorderComponents } = useOnboardingStore();
  const isSelected = selectedComponentId === component.id;
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'component',
    item: () => {
      return { id: component.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // Reset any visual states when drag ends
    },
  });

  // Custom drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    hover: (draggedItem: { id: string; index: number }, monitor) => {
      if (!draggedItem || draggedItem.id === component.id) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Only perform the move when the mouse has crossed half of the items height
      const hoverBoundingRect = dragRef.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      reorderComponents(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Connect drag and drop refs
  drag(dragRef);
  drop(dragRef);

  return (
    <motion.div
      ref={dragRef}
      initial={false}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'group relative bg-[#2a2a2a] border-2 rounded-lg transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-[#4a7fff] shadow-lg shadow-[#4a7fff]/20'
          : 'border-transparent hover:border-[#4a7fff]/50',
        isOver && canDrop && 'border-[#4a7fff] bg-[#4a7fff]/5',
        className
      )}
      onClick={() => selectComponent(component.id)}
    >
      {/* Drag Handle */}
      <motion.div
        className={cn(
          "absolute top-2 right-2 transition-all duration-200 cursor-move z-10",
          isDragging ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-6 h-6 bg-[#1f1f1f] border border-[#2a2a2a] rounded flex items-center justify-center cursor-move hover:bg-[#2a2a2a] transition-colors shadow-lg">
          <GripVertical className="w-3 h-3 text-[#888888]" />
        </div>
      </motion.div>

      {/* Drop Zone Indicator */}
      {isOver && canDrop && !isDragging && (
        <motion.div 
          className="absolute inset-0 border-2 border-dashed border-[#4a7fff] rounded-lg bg-[#4a7fff]/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Drag Preview Overlay */}
      {isDragging && (
        <motion.div 
          className="absolute inset-0 border-2 border-[#4a7fff] rounded-lg bg-[#4a7fff]/20 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Component Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
}
