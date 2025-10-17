export interface Screen {
  id: string;
  name: string;
  components: Component[];
}

export interface Component {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'gif' | 'video' | 'link';
  content: ComponentContent;
  settings: ComponentSettings;
}

export interface ComponentContent {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  gifUrl?: string;
  buttonText?: string;
  linkUrl?: string;
}

export interface ComponentSettings {
  alignment?: 'left' | 'center' | 'right';
  autoplay?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export interface OnboardingState {
  screens: Screen[];
  currentScreenId: string | null;
  selectedComponentId: string | null;
  activeTab: 'preview' | 'builder';
}

export interface ComponentType {
  type: Component['type'];
  label: string;
  description: string;
  icon: string;
}
