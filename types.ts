
export interface TaskInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  placeholder?: string;
  options?: string[]; // For select inputs
}

export interface SubModuleTask {
  id: string;
  title: string;
  description: string; // Detailed instructions
  mediaType?: 'video' | 'text' | 'audio';
  mediaContent?: string; // URL or text content
  importance?: 'mandatory' | 'recommended' | 'optional'; 
  
  // New: Multiple fields support. If specificInputs is present, we ignore the single placeholder.
  specificInputs?: TaskInput[]; 
  placeholder?: string; // Fallback for simple tasks
}

export interface SubModule {
  id: string;
  title: string;
  description: string;
  goal: string;       
  focus: string;      
  objectives: string; 
  tasks: SubModuleTask[]; 
}

export interface FrameworkPhase {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  unlockCode: string;
  strategies: string[]; 
  subModules: SubModule[]; 
  optimizationTips: string[]; 
  focus: string;
  objectives: string;
  usefulInfo: string; 
  iconName: 'Fingerprint' | 'Target' | 'Megaphone' | 'Layout' | 'Repeat';
  type: 'setup' | 'execution'; 
}

export interface BrandingAsset {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'link' | 'text';
}

export interface BrandVoice {
    tone: string; // e.g. "Professional, Friendly"
    archetype: string; // e.g. "The Sage"
    vocabulary: string; // Key words
    forbidden: string; // Words to avoid
}

export interface IdentityData {
  version: string; 
  mission: string; 
  targetAudienceSummary: string;
  selectedDomainPrefix: string; 
}

export interface ObjectivesData {
    smartGoal: string; // "100k€ ARR"
    deadline: string; // "12 months"
    currentSituation: string; // "0€, just started"
    motivation: string; // "Financial freedom"
}

export interface ClientData {
  clientName: string;
  clientDomain: string;
  identity: IdentityData;
  objectives: ObjectivesData; // New field
  unlockedPhases: string[];
  activePhaseId: string | null;
  completedItems: string[]; 
  userInputs: Record<string, string>; // Stores answer by "taskId-fieldId"
  branding: BrandingAsset[];
  brandVoice: BrandVoice; // New field
}

export interface PhaseStatus {
  phaseId: string;
  status: 'locked' | 'active' | 'completed';
}
