'use client';

import { useOnboardingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Plus, GripVertical, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Draggable Screen Item Component
function DraggableScreenItem({ screen, index }: { screen: any; index: number }) {
  const { currentScreenId, selectScreen, reorderScreens, updateScreenName } = useOnboardingStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(screen.name);
  const [showMenu, setShowMenu] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'screen',
    item: { id: screen.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'screen',
    hover: (draggedItem: { id: string; index: number }) => {
      if (!draggedItem || draggedItem.id === screen.id) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      reorderScreens(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleDeleteScreen = () => {
    const { deleteScreen, screens } = useOnboardingStore.getState();
    console.log('Attempting to delete screen:', screen.id);
    console.log('Current screens count:', screens.length);
    
    if (screens.length <= 1) {
      console.log('Cannot delete last screen');
      return;
    }
    
    deleteScreen(screen.id);
    console.log('Screen deleted successfully');
    setShowDeleteConfirm(false);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setNewName(screen.name);
    setShowMenu(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveRename = () => {
    if (newName.trim() && newName !== screen.name) {
      updateScreenName(screen.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setNewName(screen.name);
    setIsRenaming(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !dragRef.current?.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  drag(dragRef);
  drop(dragRef);

  return (
    <>
      <div
        ref={dragRef}
        className={cn(
          'group flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer',
          currentScreenId === screen.id
            ? 'bg-[#4a7fff] text-white'
            : 'bg-[#2a2a2a] text-[#888888] hover:bg-[#3a3a3a] hover:text-white',
          isDragging && 'opacity-50',
          isOver && 'border-2 border-[#4a7fff]'
        )}
        onClick={() => selectScreen(screen.id)}
      >
        <div className="flex items-center space-x-3 flex-1">
          {/* Drag Handle */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <GripVertical className="w-4 h-4" />
          </div>
          
          {/* Screen Name or Input */}
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-none outline-none font-medium text-white flex-1"
              autoFocus
            />
          ) : (
            <span className="font-medium truncate">{screen.name}</span>
          )}
        </div>

        {/* More Options */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {/* Context Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-white hover:bg-[#3a3a3a] rounded-t-lg"
              >
                <Edit2 className="w-4 h-4" />
                <span>Rename</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-[#3a3a3a] rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Screen</h3>
            <p className="text-[#888888] mb-4">
              Are you sure you want to delete this screen? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteScreen}
                className="flex-1 py-2 px-4 bg-[#ff4444] hover:bg-[#ff5555] text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ScreenList() {
  const { 
    screens, 
    addScreen
  } = useOnboardingStore();

  return (
    <div className="w-80 bg-[#111111] border-r border-[#2a2a2a] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white">Screens</h2>
      </div>

      {/* Screen List */}
      <div className="flex-1 p-4 space-y-2">
        {screens.map((screen, index) => (
          <DraggableScreenItem key={screen.id} screen={screen} index={index} />
        ))}
      </div>

      {/* Add Screen Button */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <button
          onClick={addScreen}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#888888] hover:text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Screen</span>
        </button>
      </div>
    </div>
  );
}
