import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingState, Screen, Component, ComponentSettings } from '../shared/types';

interface OnboardingStore extends OnboardingState {
  // Database sync
  currentExperienceId: string | null;
  isDirty: boolean;
  isLoading: boolean;
  
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
  
  // Database operations
  loadExperience: (experienceId: string) => Promise<void>;
  saveExperience: (name: string, description?: string) => Promise<string | null>;
  publishExperience: (experienceId: string) => Promise<boolean>;
  createNewExperience: () => void;
  
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
      currentExperienceId: null,
      isDirty: false,
      isLoading: false,

      // Screen management
      addScreen: () => {
        const newScreen: Screen = {
          id: `screen-${Date.now()}`,
          name: `Screen ${get().screens.length + 1}`,
          components: []
        };
        set((state) => ({
          screens: [...state.screens, newScreen],
          currentScreenId: newScreen.id,
          isDirty: true
        }));
      },

      selectScreen: (screenId: string) => {
        set({ currentScreenId: screenId, selectedComponentId: null });
      },

      updateScreenName: (screenId: string, name: string) => {
        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === screenId ? { ...screen, name } : screen
          ),
          isDirty: true
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
          selectedComponentId: null,
          isDirty: true
        });
      },

      reorderScreens: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newScreens = [...state.screens];
          const [movedScreen] = newScreens.splice(fromIndex, 1);
          newScreens.splice(toIndex, 0, movedScreen);
          return { screens: newScreens, isDirty: true };
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
          selectedComponentId: newComponent.id,
          isDirty: true
        }));
      },

      updateComponent: (componentId: string, updates: Partial<Component>) => {
        set((state) => ({
          screens: state.screens.map((screen) => ({
            ...screen,
            components: screen.components.map((component) =>
              component.id === componentId ? { ...component, ...updates } : component
            )
          })),
          isDirty: true
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
          selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
          isDirty: true
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
          ),
          isDirty: true
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

      // Database operations
      loadExperience: async (experienceId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/experiences/${experienceId}`);
          if (!response.ok) {
            throw new Error('Failed to load experience');
          }
          
          const { experience } = await response.json();
          
          // Transform database format to store format
          const screens = experience.onboarding_screens?.map((screen: any) => ({
            id: screen.id,
            name: screen.name,
            components: screen.onboarding_components?.map((component: any) => ({
              id: component.id,
              type: component.type,
              content: component.content,
              settings: component.settings
            })) || []
          })) || [];

          set({
            screens: screens.length > 0 ? screens : [{ id: 'screen-1', name: 'Screen 1', components: [] }],
            currentScreenId: screens[0]?.id || 'screen-1',
            selectedComponentId: null,
            currentExperienceId: experienceId,
            isDirty: false,
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading experience:', error);
          set({ isLoading: false });
        }
      },

      saveExperience: async (name: string, description?: string) => {
        const state = get();
        set({ isLoading: true });
        
        try {
          const url = state.currentExperienceId 
            ? `/api/experiences/${state.currentExperienceId}`
            : '/api/experiences';
          
          const method = state.currentExperienceId ? 'PUT' : 'POST';
          
          console.log('Saving experience:', { url, method, name, description, screens: state.screens });
          
          const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              description,
              screens: state.screens
            })
          });

          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error(`Failed to save experience: ${response.status} ${errorText}`);
          }

          const { experience } = await response.json();
          console.log('Saved experience:', experience);
          
          set({
            currentExperienceId: experience.id,
            isDirty: false,
            isLoading: false
          });

          return experience.id;
        } catch (error) {
          console.error('Error saving experience:', error);
          set({ isLoading: false });
          return null;
        }
      },

      publishExperience: async (experienceId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`/api/experiences/${experienceId}/publish`, {
            method: 'POST'
          });

          if (!response.ok) {
            throw new Error('Failed to publish experience');
          }

          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Error publishing experience:', error);
          set({ isLoading: false });
          return false;
        }
      },

      createNewExperience: () => {
        set({
          screens: [{ id: 'screen-1', name: 'Screen 1', components: [] }],
          currentScreenId: 'screen-1',
          selectedComponentId: null,
          currentExperienceId: null,
          isDirty: false,
          activeTab: 'builder'
        });
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
        currentScreenId: state.currentScreenId,
        currentExperienceId: state.currentExperienceId,
        isDirty: state.isDirty
      })
    }
  )
);

// Helper functions for default values
function getDefaultContent(type: Component['type']) {
  switch (type) {
    case 'heading':
      return { text: 'New Heading' };
    case 'paragraph':
      return { text: 'New paragraph text...' };
    case 'image':
      return { imageUrl: '' };
    case 'video':
      return { videoUrl: '', videoEmbedUrl: '' };
    case 'gif':
      return { gifUrl: '' };
    case 'link':
      return { buttonText: 'Click Here', linkUrl: '' };
    default:
      return {};
  }
}

function getDefaultSettings(type: Component['type']): ComponentSettings {
  switch (type) {
    case 'heading':
      return { alignment: 'center' as const, size: 'large' as const };
    case 'paragraph':
      return { alignment: 'left' as const, size: 'medium' as const };
    case 'image':
      return { alignment: 'center' as const, size: 'medium' as const };
    case 'video':
      return { alignment: 'center' as const, autoplay: false };
    case 'gif':
      return { alignment: 'center' as const, size: 'medium' as const };
    case 'link':
      return { alignment: 'center' as const, color: '#4a7fff' };
    default:
      return {};
  }
}