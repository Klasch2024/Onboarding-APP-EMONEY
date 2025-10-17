import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingState, Screen, Component } from './types';

interface OnboardingStore extends OnboardingState {
  // Screen management
  addScreen: () => void;
  selectScreen: (screenId: string) => void;
  updateScreenName: (screenId: string, name: string) => void;
  deleteScreen: (screenId: string) => void;
  reorderScreens: (fromIndex: number, toIndex: number) => void;
  
  // Component management
  addComponent: (type: Component['type']) => void;
  updateComponent: (componentId: string, updates: Partial<Component>) => void;
  deleteComponent: (componentId: string) => void;
  selectComponent: (componentId: string | null) => void;
  reorderComponents: (fromIndex: number, toIndex: number) => void;
  
  // Tab management
  setActiveTab: (tab: OnboardingState['activeTab']) => void;
  
  // Utility
  getCurrentScreen: () => Screen | null;
  getSelectedComponent: () => Component | null;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      screens: [
        {
          id: 'screen-1',
          name: 'Screen 1',
          components: []
        }
      ],
      currentScreenId: 'screen-1',
      selectedComponentId: null,
      activeTab: 'builder',

      // Screen management
      addScreen: () => {
        const newScreen: Screen = {
          id: `screen-${Date.now()}`,
          name: `Screen ${get().screens.length + 1}`,
          components: []
        };
        set((state) => ({
          screens: [...state.screens, newScreen],
          currentScreenId: newScreen.id
        }));
      },

      selectScreen: (screenId: string) => {
        set({ currentScreenId: screenId, selectedComponentId: null });
      },

      updateScreenName: (screenId: string, name: string) => {
        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === screenId ? { ...screen, name } : screen
          )
        }));
      },

      deleteScreen: (screenId: string) => {
        const state = get();
        if (state.screens.length <= 1) return; // Don't delete the last screen
        
        const newScreens = state.screens.filter(screen => screen.id !== screenId);
        const newCurrentScreenId = state.currentScreenId === screenId 
          ? newScreens[0]?.id || null 
          : state.currentScreenId;
        
        set({
          screens: newScreens,
          currentScreenId: newCurrentScreenId,
          selectedComponentId: null
        });
      },

      reorderScreens: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newScreens = [...state.screens];
          const [movedScreen] = newScreens.splice(fromIndex, 1);
          newScreens.splice(toIndex, 0, movedScreen);
          return { screens: newScreens };
        });
      },

      // Component management
      addComponent: (type: Component['type']) => {
        const state = get();
        const currentScreen = state.getCurrentScreen();
        if (!currentScreen) return;

        const newComponent: Component = {
          id: `component-${Date.now()}`,
          type,
          content: getDefaultContent(type),
          settings: getDefaultSettings(type)
        };

        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === currentScreen.id
              ? { ...screen, components: [...screen.components, newComponent] }
              : screen
          ),
          selectedComponentId: newComponent.id
        }));
      },

      updateComponent: (componentId: string, updates: Partial<Component>) => {
        set((state) => ({
          screens: state.screens.map((screen) => ({
            ...screen,
            components: screen.components.map((component) =>
              component.id === componentId ? { ...component, ...updates } : component
            )
          }))
        }));
      },

      deleteComponent: (componentId: string) => {
        const state = get();
        const currentScreen = state.getCurrentScreen();
        if (!currentScreen) return;

        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === currentScreen.id
              ? {
                  ...screen,
                  components: screen.components.filter(
                    (component) => component.id !== componentId
                  )
                }
              : screen
          ),
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId
        }));
      },

      selectComponent: (componentId: string | null) => {
        set({ selectedComponentId: componentId });
      },

      reorderComponents: (fromIndex: number, toIndex: number) => {
        const state = get();
        const currentScreen = state.getCurrentScreen();
        if (!currentScreen) return;

        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === currentScreen.id
              ? {
                  ...screen,
                  components: (() => {
                    const newComponents = [...screen.components];
                    const [movedComponent] = newComponents.splice(fromIndex, 1);
                    newComponents.splice(toIndex, 0, movedComponent);
                    return newComponents;
                  })()
                }
              : screen
          )
        }));
      },

      // Tab management
      setActiveTab: (tab: OnboardingState['activeTab']) => {
        if (tab === 'preview') {
          // When switching to preview, always start with the first screen
          const state = get();
          const firstScreen = state.screens[0];
          set({ 
            activeTab: tab, 
            selectedComponentId: null,
            currentScreenId: firstScreen?.id || null
          });
        } else {
          set({ activeTab: tab, selectedComponentId: null });
        }
      },

      // Utility functions
      getCurrentScreen: () => {
        const state = get();
        return state.screens.find(screen => screen.id === state.currentScreenId) || null;
      },

      getSelectedComponent: () => {
        const state = get();
        const currentScreen = state.getCurrentScreen();
        if (!currentScreen || !state.selectedComponentId) return null;
        return currentScreen.components.find(
          component => component.id === state.selectedComponentId
        ) || null;
      }
    }),
    {
      name: 'onboarding-store',
      partialize: (state) => ({
        screens: state.screens,
        currentScreenId: state.currentScreenId
      })
    }
  )
);

// Helper functions for default values
function getDefaultContent(type: Component['type']) {
  switch (type) {
    case 'heading':
      return { text: 'Heading' };
    case 'paragraph':
      return { text: 'Add your text here...' };
    case 'image':
      return { imageUrl: '' };
    case 'video':
      return { videoUrl: '' };
    case 'gif':
      return { gifUrl: '' };
    case 'link':
      return { buttonText: 'Button Text', linkUrl: 'https://example.com' };
    default:
      return {};
  }
}

function getDefaultSettings(type: Component['type']) {
  const baseSettings = { alignment: 'left' as const };
  
  switch (type) {
    case 'video':
      return { ...baseSettings, autoplay: false };
    case 'link':
      return { ...baseSettings, size: 'medium' as const };
    default:
      return baseSettings;
  }
}
