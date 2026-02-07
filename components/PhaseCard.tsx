import React from 'react';
import { Target, Megaphone, Layout, Repeat, Lock, ArrowRight, Fingerprint } from 'lucide-react';
import { FrameworkPhase } from '../types';

interface PhaseCardProps {
  phase: FrameworkPhase;
  isUnlocked: boolean;
  progress: number;
  onUnlock: () => void;
  onClick: () => void;
}

const icons = {
  Target,
  Megaphone,
  Layout,
  Repeat,
  Fingerprint
};

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, isUnlocked, progress, onUnlock, onClick }) => {
  const Icon = icons[phase.iconName];
  const isSetup = phase.type === 'setup';

  if (!isUnlocked) {
    return (
      <div 
        onClick={onUnlock}
        className="group relative h-full rounded-xl overflow-hidden cursor-pointer"
      >
        {/* Blurred Background Layer */}
        <div className="absolute inset-0 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md z-10 flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-white/30 dark:group-hover:bg-zinc-900/30">
             <div className="w-12 h-12 bg-white/80 dark:bg-black/80 rounded-full flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                <Lock size={20} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
                {phase.title}
            </span>
        </div>

        {/* Underlying "Fake" Content to create depth behind blur */}
        <div className="h-full p-6 flex flex-col justify-between opacity-30 grayscale pointer-events-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
             <div>
                 <div className="p-3 w-fit rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400">
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mt-6 mb-2 text-zinc-400">{phase.title}</h3>
                <div className="h-2 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
                <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`group relative h-full rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all duration-300 ${
          isSetup 
          ? 'bg-zinc-900 dark:bg-white border border-zinc-900 dark:border-white text-white dark:text-black' 
          : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800'
      }`}
    >
        <div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-lg border ${
                    isSetup 
                    ? 'bg-zinc-800 dark:bg-zinc-200 border-zinc-700 dark:border-zinc-300 text-white dark:text-black' 
                    : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white'
                }`}>
                    <Icon size={24} strokeWidth={1.5} />
                </div>
                {progress === 100 && (
                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                         isSetup 
                         ? 'bg-green-500/20 text-green-300 dark:text-green-700' 
                         : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                     }`}>
                        Complet
                    </span>
                )}
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${isSetup ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>{phase.title}</h3>
            <p className={`text-sm line-clamp-2 leading-relaxed ${isSetup ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {phase.goal}
            </p>
        </div>

        <div className="mt-6">
             <div className="flex justify-between text-xs mb-2">
                <span className={`font-medium ${isSetup ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-400'}`}>Progression</span>
                <span className={`font-mono ${isSetup ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>{progress}%</span>
             </div>
             <div className={`h-1.5 w-full rounded-full overflow-hidden ${isSetup ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                <div 
                    className={`h-full transition-all duration-500 ${isSetup ? 'bg-white dark:bg-black' : 'bg-zinc-900 dark:bg-white'}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
             <div className={`mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 ${isSetup ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                {isSetup ? 'Configurer' : 'Ouvrir le module'} <ArrowRight size={14} className="ml-1" />
            </div>
        </div>
    </div>
  );
};

export default PhaseCard;