import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Target, 
  Zap, 
  Lightbulb, 
  BookOpen, 
  ListTodo, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Info,
  Layers,
  Check,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  PlayCircle,
  Save,
  FileText,
  LayoutTemplate,
  Link2,
  Copy,
  Circle,
  CircleDot,
  Lock,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Play,
  CheckCircle2
} from 'lucide-react';
import { FRAMEWORK_DATA } from '../constants';
import { ClientData, SubModule, SubModuleTask } from '../types';
import Identity from './Identity'; 

interface PhaseDetailProps {
  clientData: ClientData;
  updateClientData: (data: ClientData) => void;
}

type TabType = 'overview' | 'introduction' | 'checklist' | 'resources';

const PhaseDetail: React.FC<PhaseDetailProps> = ({ clientData, updateClientData }) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = (searchParams.get('tab') as TabType) || 'overview';
  const activeSubModuleId = searchParams.get('subModule');
  const activeTaskId = searchParams.get('task');
  
  const phase = FRAMEWORK_DATA.find(p => p.id === id);

  // State for inputs & Expert Mode Toggle
  const [currentInputs, setCurrentInputs] = useState<Record<string, string>>({});
  const [isExpertMode, setIsExpertMode] = useState(false);

  useEffect(() => {
     if (!searchParams.get('tab') && !activeSubModuleId && !activeTaskId) {
         setSearchParams({ tab: 'overview' });
     }
  }, [id]);

  // Load existing input when task changes
  useEffect(() => {
      if(activeTaskId && phase && activeSubModuleId) {
          const sub = phase.subModules.find(s => s.id === activeSubModuleId);
          const task = sub?.tasks.find(t => t.id === activeTaskId);
          if(task) {
              const uniqueTaskId = `${phase.id}-${sub?.id}-${task.id}`;
              
              const newInputsState: Record<string, string> = {};
              
              if (task.specificInputs) {
                  task.specificInputs.forEach(input => {
                      const storageKey = `${uniqueTaskId}-${input.id}`;
                      newInputsState[input.id] = clientData.userInputs?.[storageKey] || '';
                  });
              }
              // Always load main input too (for expert mode or fallback)
              newInputsState['main'] = clientData.userInputs?.[uniqueTaskId] || '';

              setCurrentInputs(newInputsState);
              // Check if user has data in "main" but not in specific inputs => imply expert mode used previously
              if (!task.specificInputs && newInputsState['main']) {
                  setIsExpertMode(true);
              } else {
                  setIsExpertMode(false);
              }
          }
      }
  }, [activeTaskId, activeSubModuleId, phase, clientData.userInputs]);

  if (!phase) return <div>Phase introuvable</div>;
  if (phase.id === 'identity') return <Identity clientData={clientData} updateClientData={updateClientData} />;

  // --- Logic Helpers ---

  const isCompleted = (uniqueId: string) => clientData.completedItems.includes(uniqueId);

  const toggleItem = (uniqueId: string, forceState?: boolean) => {
    let newCompleted = [...clientData.completedItems];
    const exists = newCompleted.includes(uniqueId);

    if (forceState === true && !exists) {
        newCompleted.push(uniqueId);
    } else if (forceState === false && exists) {
        newCompleted = newCompleted.filter(i => i !== uniqueId);
    } else if (forceState === undefined) {
        if (exists) {
            newCompleted = newCompleted.filter(i => i !== uniqueId);
        } else {
            newCompleted.push(uniqueId);
        }
    }
    
    updateClientData({ ...clientData, completedItems: newCompleted });
  };

  const saveTaskInputs = (subModuleId: string, taskId: string) => {
      const task = phase.subModules.find(s => s.id === subModuleId)?.tasks.find(t => t.id === taskId);
      if(!task) return;

      const uniqueTaskId = `${phase.id}-${subModuleId}-${taskId}`;
      const newGlobalInputs = { ...clientData.userInputs };
      let hasContent = false;

      // Save Guided Inputs
      if (task.specificInputs) {
          task.specificInputs.forEach(input => {
              const val = currentInputs[input.id] || '';
              newGlobalInputs[`${uniqueTaskId}-${input.id}`] = val;
              if (val.trim().length > 1) hasContent = true;
          });
      }
      
      // Save Expert/Main Input
      const mainVal = currentInputs['main'] || '';
      newGlobalInputs[uniqueTaskId] = mainVal;
      if (mainVal.trim().length > 1) hasContent = true;

      // Update Data
      updateClientData({ ...clientData, userInputs: newGlobalInputs });
      
      // Auto-validate if content is sufficient (Seamless UX)
      if (hasContent) {
          toggleItem(uniqueTaskId, true);
      }
  };

  const isSubModuleComplete = (sub: SubModule) => {
      return sub.tasks.every(t => isCompleted(`${phase.id}-${sub.id}-${t.id}`));
  };

  const isSubModuleLocked = (subIndex: number) => {
      if (subIndex === 0) return false;
      const prevSub = phase.subModules[subIndex - 1];
      return !isSubModuleComplete(prevSub);
  };

  const getSubModuleProgress = (sub: SubModule) => {
      const total = sub.tasks.length;
      if (total === 0) return 0;
      const completed = sub.tasks.filter(t => isCompleted(`${phase.id}-${sub.id}-${t.id}`)).length;
      return Math.round((completed / total) * 100);
  };

  const getTotalProgress = () => {
      let subTotal = 0;
      let subCompleted = 0;
      if (phase.subModules) {
          phase.subModules.forEach(sub => {
              subTotal += sub.tasks.length;
              subCompleted += sub.tasks.filter(t => isCompleted(`${phase.id}-${sub.id}-${t.id}`)).length;
          });
      }
      if (subTotal === 0) return 0;
      return Math.round((subCompleted / subTotal) * 100);
  };

  // Find the next logical step (Linear Progression)
  const getNextAction = () => {
      if (!phase.subModules) return null;
      
      for (const sub of phase.subModules) {
          // If sub not complete, find the task
          if (!isSubModuleComplete(sub)) {
              const firstUnfinished = sub.tasks.find(t => !isCompleted(`${phase.id}-${sub.id}-${t.id}`));
              if (firstUnfinished) {
                  return {
                      subModuleId: sub.id,
                      taskId: firstUnfinished.id,
                      subTitle: sub.title,
                      taskTitle: firstUnfinished.title,
                      type: 'task',
                      label: `Continuer : ${firstUnfinished.title}`
                  };
              }
          }
      }
      return null;
  };

  // Helper to find the NEXT sub-module when one is finished
  const getNextSubModule = (currentSubId: string) => {
      const idx = phase.subModules.findIndex(s => s.id === currentSubId);
      if (idx !== -1 && idx < phase.subModules.length - 1) {
          return phase.subModules[idx + 1];
      }
      return null;
  };

  const handleTabChange = (tab: TabType) => setSearchParams({ tab });
  const openSubModule = (subId: string) => setSearchParams({ subModule: subId });
  const closeSubModule = () => setSearchParams({ tab: 'checklist' });
  const openTask = (subId: string, taskId: string) => setSearchParams({ subModule: subId, task: taskId });
  const closeTask = (subId: string) => setSearchParams({ subModule: subId });

  const getImportanceBadge = (importance?: string) => {
      switch (importance) {
          case 'mandatory':
              return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white"><CircleDot size={12} fill="currentColor" /> Core</span>;
          case 'recommended':
              return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"><Circle size={12} strokeWidth={2.5} /> Expansion</span>;
          case 'optional':
              return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600"><span className="w-2 h-px bg-current"></span> Bonus</span>;
          default:
              return null;
      }
  };

  const renderRichText = (text: string) => {
      return text.split('\n').map((line, i) => {
          if (line.trim().toUpperCase() === line.trim() && line.trim().length > 3 && !line.includes(':')) {
               return <h4 key={i} className="font-bold text-zinc-900 dark:text-white mt-4 mb-2">{line}</h4>;
          } else if (line.startsWith('1.') || line.startsWith('2.')) {
              return <p key={i} className="font-semibold text-zinc-800 dark:text-zinc-200 mt-2">{line}</p>
          } else if (line.includes(':')) {
              const parts = line.split(':');
              return <p key={i} className="text-zinc-600 dark:text-zinc-400 mb-1"><span className="font-medium text-zinc-900 dark:text-zinc-300">{parts[0]}:</span>{parts.slice(1).join(':')}</p>
          } else if (line.trim() === '') {
              return <div key={i} className="h-2"></div>
          }
          return <p key={i} className="text-zinc-600 dark:text-zinc-400 mb-1">{line}</p>;
      });
  };

  const totalProgress = getTotalProgress();
  const nextAction = getNextAction();

  // ----------------------------------------------------------------------------------
  // VIEW: TASK EXECUTION
  // ----------------------------------------------------------------------------------
  if (activeTaskId && activeSubModuleId) {
      const subModule = phase.subModules.find(s => s.id === activeSubModuleId);
      const task = subModule?.tasks.find(t => t.id === activeTaskId);
      
      if (!subModule || !task) return <div>Tâche introuvable</div>;

      const uniqueId = `${phase.id}-${subModule.id}-${task.id}`;
      const taskIndex = subModule.tasks.findIndex(t => t.id === task.id);
      const nextTask = subModule.tasks[taskIndex + 1];
      const prevTask = subModule.tasks[taskIndex - 1];

      return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] animate-in fade-in duration-300 pb-32">
             {/* Navigation Header */}
             <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                <button onClick={() => closeTask(subModule.id)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <ArrowLeft size={16} />
                    <span className="text-sm font-medium">Retour</span>
                </button>
                <span className="text-xs font-mono text-zinc-400">
                    {taskIndex + 1} / {subModule.tasks.length}
                </span>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 
                 {/* LEFT: Context */}
                 <div className="pr-4">
                     <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                             {getImportanceBadge(task.importance)}
                        </div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{task.title}</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                            {task.description}
                        </p>
                     </div>

                     {task.mediaContent && (
                         <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl mb-8">
                             <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
                                 <Lightbulb size={18} className="text-zinc-500" />
                                 <h3 className="font-bold text-sm uppercase tracking-wide">Conseil Stratégique</h3>
                             </div>
                             <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                 {renderRichText(task.mediaContent)}
                             </div>
                         </div>
                     )}
                 </div>

                 {/* RIGHT: Input Area */}
                 <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-subtle overflow-hidden relative">
                     
                     {/* Workspace Header */}
                     <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex justify-between items-center backdrop-blur-sm">
                         <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                                <Zap size={14} className="text-zinc-400" />
                                Espace de Travail
                            </h3>
                         </div>
                         
                         <div className="flex items-center gap-4">
                             {/* TOGGLE: Template vs Expert */}
                             <button 
                                onClick={() => setIsExpertMode(!isExpertMode)}
                                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                                title={isExpertMode ? "Passer en mode Guidé" : "Passer en mode Texte Libre"}
                             >
                                 {isExpertMode ? (
                                     <>
                                        <ToggleRight size={20} className="text-zinc-900 dark:text-white" />
                                        Libre
                                     </>
                                 ) : (
                                     <>
                                        <ToggleLeft size={20} className="text-zinc-300" />
                                        Guidé
                                     </>
                                 )}
                             </button>
                         </div>
                     </div>
                     
                     <div className="flex-1 p-6">
                        <div className="space-y-6">
                            {!isExpertMode && task.specificInputs ? (
                                // --- MODE GUIDÉ (Template) ---
                                task.specificInputs.map(input => (
                                    <div key={input.id} className="animate-in slide-in-from-bottom-2 duration-300">
                                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
                                            {input.label}
                                        </label>
                                        {input.type === 'textarea' ? (
                                            <textarea
                                                value={currentInputs[input.id] || ''}
                                                onChange={(e) => setCurrentInputs({...currentInputs, [input.id]: e.target.value})}
                                                onBlur={() => saveTaskInputs(subModule.id, task.id)}
                                                placeholder={input.placeholder}
                                                rows={3}
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all resize-y placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                            />
                                        ) : input.type === 'select' ? (
                                            <div className="relative">
                                                    <select
                                                    value={currentInputs[input.id] || ''}
                                                    onChange={(e) => setCurrentInputs({...currentInputs, [input.id]: e.target.value})}
                                                    onBlur={() => saveTaskInputs(subModule.id, task.id)}
                                                    className="w-full appearance-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all text-zinc-900 dark:text-white"
                                                >
                                                    <option value="" disabled>{input.placeholder || 'Sélectionner...'}</option>
                                                    {input.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                                    <ChevronRight size={14} className="rotate-90" />
                                                </div>
                                            </div>
                                        ) : (
                                            <input
                                                type={input.type}
                                                value={currentInputs[input.id] || ''}
                                                onChange={(e) => setCurrentInputs({...currentInputs, [input.id]: e.target.value})}
                                                onBlur={() => saveTaskInputs(subModule.id, task.id)}
                                                placeholder={input.placeholder}
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                // --- MODE EXPERT (Plain Text) ---
                                <div className="h-full flex flex-col animate-in fade-in duration-300">
                                    <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs">
                                        <Pencil size={12} />
                                        <span>Zone de rédaction libre</span>
                                    </div>
                                    <textarea
                                        value={currentInputs['main'] || ''}
                                        onChange={(e) => setCurrentInputs({ ...currentInputs, main: e.target.value })}
                                        onBlur={() => saveTaskInputs(subModule.id, task.id)}
                                        placeholder={task.placeholder || "Écrivez votre réponse ici..."}
                                        className="w-full min-h-[400px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-mono"
                                    />
                                </div>
                            )}
                        </div>
                     </div>
                 </div>
             </div>

             {/* THE FLOW BAR (Sticky Bottom) - Inside Task */}
            <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
                 {/* Gradient Mask to hide content behind */}
                 <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-zinc-950 dark:via-zinc-950/95"></div>
                 
                 {/* Content Wrapper */}
                 <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto px-6 md:px-12 pb-8 pt-12 pointer-events-auto">
                    {/* Previous (Secondary) */}
                    <button 
                        onClick={() => prevTask && openTask(subModule.id, prevTask.id)}
                        disabled={!prevTask}
                        className={`text-sm font-medium ${!prevTask ? 'text-zinc-300 opacity-0 pointer-events-none' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                    >
                        ← Précédent
                    </button>

                    {/* Primary Action (Center/Right) */}
                    <div className="flex items-center gap-4">
                        <button 
                             onClick={() => saveTaskInputs(subModule.id, task.id)} 
                             className="text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-4 py-2"
                        >
                            Sauvegarder
                        </button>
                        
                        <button 
                            onClick={() => {
                                saveTaskInputs(subModule.id, task.id);
                                if(nextTask) {
                                    openTask(subModule.id, nextTask.id);
                                } else {
                                    closeTask(subModule.id);
                                }
                            }}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black h-12 px-8 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            {nextTask ? 'Suivant' : 'Terminer le Module'} <ArrowRight size={16} />
                        </button>
                    </div>
                 </div>
            </div>
        </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: SUB-MODULE LIST (Deep Dive)
  // ----------------------------------------------------------------------------------
  if (activeSubModuleId) {
      const subModule = phase.subModules.find(s => s.id === activeSubModuleId);
      if (!subModule) return <div>Sous-module introuvable</div>;
      
      const subProgress = getSubModuleProgress(subModule);
      const firstUnfinishedTask = subModule.tasks.find(t => !isCompleted(`${phase.id}-${subModule.id}-${t.id}`)) || subModule.tasks[0];
      const nextSubModule = getNextSubModule(subModule.id);

      return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-40 relative min-h-screen">
            <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                    <LayoutDashboard size={14} /> Dashboard
                </Link>
                <ChevronRight size={14} />
                <button onClick={closeSubModule} className="hover:text-zinc-900 dark:hover:text-zinc-100">
                    {phase.title}
                </button>
                <ChevronRight size={14} />
                <span className="font-semibold text-zinc-900 dark:text-white">{subModule.title}</span>
            </nav>

            {/* SubModule Header */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
                <button 
                    onClick={closeSubModule} 
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                
                <div className="mt-8 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-medium text-zinc-500 uppercase">
                            Sub-Module
                        </span>
                        {subProgress === 100 && (
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                                <Check size={12} /> Complet
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                        {subModule.title}
                    </h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                        {subModule.description}
                    </p>
                </div>

                <div className="mt-4">
                     <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium text-zinc-400">Avancement</span>
                        <span className="font-mono text-zinc-900 dark:text-white">{subProgress}%</span>
                     </div>
                     <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-zinc-900 dark:bg-white transition-all duration-500"
                            style={{ width: `${subProgress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
                            <Target size={20} className="text-zinc-500" />
                            <h3 className="font-bold">Objectif</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{subModule.goal}</p>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <ListTodo size={24} className="text-zinc-900 dark:text-white" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Plan d'action</h2>
                    </div>

                    <div className="space-y-3">
                        {subModule.tasks.map((task, idx) => {
                             const uniqueId = `${phase.id}-${subModule.id}-${task.id}`;
                             const isTaskDone = isCompleted(uniqueId);
                             const hasInput = Object.keys(clientData.userInputs).some(k => k.startsWith(uniqueId));
                             
                             return (
                                <div 
                                    key={idx}
                                    onClick={() => openTask(subModule.id, task.id)}
                                    className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all group ${
                                        isTaskDone 
                                        ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' 
                                        : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
                                    }`}
                                >
                                     <div className="flex items-center gap-4">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                            isTaskDone
                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-black' 
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                         }`}>
                                            {isTaskDone ? <Check size={14} /> : idx + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className={`text-base font-medium transition-colors ${isTaskDone ? 'text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                                                    {task.title}
                                                </p>
                                                {getImportanceBadge(task.importance)}
                                            </div>
                                            {hasInput && !isTaskDone && <p className="text-xs text-zinc-400">Brouillon en cours</p>}
                                        </div>
                                     </div>
                                     <div className="p-2 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                         <PlayCircle size={20} />
                                     </div>
                                </div>
                             )
                        })}
                    </div>
                </div>
            </div>

            {/* THE FLOW BAR (Sticky Bottom) - Inside SubModule List */}
            <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
                 <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950"></div>
                 
                 <div className="relative z-10 flex flex-col items-center justify-center pb-12 pt-16 pointer-events-auto">
                    
                    {subProgress === 100 ? (
                        // CASE: SubModule Complete -> Go to Next SubModule
                        nextSubModule ? (
                             <button 
                                onClick={() => openSubModule(nextSubModule.id)}
                                className="bg-zinc-900 dark:bg-white text-white dark:text-black h-14 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 group"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Module Terminé</span>
                                    <span className="text-base font-bold">Passer à {nextSubModule.title}</span>
                                </div>
                                <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center text-black dark:text-white group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={16} />
                                </div>
                            </button>
                        ) : (
                            // CASE: All SubModules Done -> Finish Phase
                             <button 
                                onClick={closeSubModule}
                                className="bg-green-600 text-white h-14 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
                            >
                                <CheckCircle2 size={20} />
                                <span className="text-base font-bold">Phase Complète - Retour</span>
                            </button>
                        )
                    ) : (
                        // CASE: Tasks Remaining -> Continue
                        <button 
                            onClick={() => openTask(subModule.id, firstUnfinishedTask.id)}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black h-14 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 group"
                        >
                            <span className="text-base font-bold">Continuer : {firstUnfinishedTask.title}</span>
                            <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center text-black dark:text-white group-hover:translate-x-1 transition-transform">
                                <Play size={14} fill="currentColor" />
                            </div>
                        </button>
                    )}
                 </div>
            </div>
        </div>
      );
  }

  // ----------------------------------------------------------------------------------
  // VIEW: MAIN PHASE (TABS)
  // ----------------------------------------------------------------------------------

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-40 relative min-h-screen">
        
        {/* Module Header & Tabs */}
        <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl z-20 border-b border-zinc-100 dark:border-zinc-800 -mx-6 md:-mx-12 px-6 md:px-12 pt-6">
             <div className="flex items-center justify-between mb-4">
                 <div>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">
                        {phase.subtitle}
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{phase.title}</h1>
                 </div>
                 <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">{totalProgress}%</span>
                 </div>
             </div>

             <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {[
                    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                    { id: 'introduction', label: 'Introduction', icon: Info },
                    { id: 'checklist', label: 'Modules & Ressources', icon: ListTodo },
                    { id: 'resources', label: 'Aide & Informations', icon: BookOpen },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as TabType)}
                            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                                isActive 
                                ? 'text-zinc-900 dark:text-white border-zinc-900 dark:border-white' 
                                : 'text-zinc-500 border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
             </div>
        </div>

        {/* CONTENT AREA */}
        <div className="py-4">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl p-8 relative overflow-hidden shadow-xl">
                         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-md">
                                <h2 className="text-3xl font-bold mb-2">État du Module</h2>
                                <p className="text-zinc-300 dark:text-zinc-600 mb-6">
                                    {totalProgress === 100 ? "Module validé." : "Complétez les sub-modules dans l'ordre pour débloquer la suite."}
                                </p>
                                <div className="h-4 w-full bg-white/20 dark:bg-black/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white dark:bg-black transition-all duration-1000 ease-out" style={{ width: `${totalProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Sub-modules List with LOCK Logic */}
                     {phase.subModules && phase.subModules.length > 0 && (
                        <div>
                             <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                <Layers size={18} />
                                Progression
                             </h3>
                             <div className="grid grid-cols-1 gap-4">
                                {phase.subModules.map((sub, idx) => {
                                    const complete = isSubModuleComplete(sub);
                                    const subProgress = getSubModuleProgress(sub);
                                    const isLocked = isSubModuleLocked(idx);

                                    return (
                                        <div 
                                            key={sub.id}
                                            onClick={() => !isLocked && openSubModule(sub.id)}
                                            className={`p-6 rounded-xl border transition-all duration-300 group ${
                                                isLocked
                                                ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 cursor-not-allowed opacity-75'
                                                : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 cursor-pointer hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-600'
                                            } ${complete ? 'opacity-80' : ''}`}
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    {isLocked ? (
                                                        <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-500">
                                                            <Lock size={20} />
                                                        </div>
                                                    ) : (
                                                        <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{sub.title}</h4>
                                                    )}
                                                </div>
                                                {complete ? <CheckCircleIcon /> : !isLocked && <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors"><ArrowRight size={20} /></div>}
                                            </div>
                                            
                                            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-2xl">{isLocked ? "Terminez le module précédent pour débloquer." : sub.description}</p>

                                            {!isLocked && (
                                                <div className="flex items-center gap-4">
                                                    <div className="h-2 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-zinc-900 dark:bg-white rounded-full" style={{ width: `${subProgress}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-mono text-zinc-500">{subProgress}%</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                             </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* TAB: CHECKLIST */}
            {activeTab === 'checklist' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    {phase.subModules.map((sub, idx) => {
                        const complete = isSubModuleComplete(sub);
                        const isLocked = isSubModuleLocked(idx);
                        return (
                            <div 
                                key={sub.id} 
                                onClick={() => !isLocked && openSubModule(sub.id)}
                                className={`rounded-xl border transition-all duration-300 group ${
                                    isLocked 
                                    ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 cursor-not-allowed' 
                                    : 'bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 cursor-pointer hover:shadow-lg'
                                }`}
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex-1 opacity-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            {isLocked && <Lock size={16} className="text-zinc-400" />}
                                            <h3 className={`font-bold text-lg ${complete ? 'text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>
                                                {sub.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-zinc-500">{isLocked ? "Verrouillé" : sub.description}</p>
                                    </div>
                                    {!isLocked && <ArrowRight size={20} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TAB: INTRODUCTION & RESOURCES - Kept simple */}
            {(activeTab === 'introduction' || activeTab === 'resources') && (
                // ... same content as before, keeping brevity
                <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Contexte & Objectifs</h2>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed mb-8">{phase.goal}</p>
                    </div>
                </div>
            )}

        </div>

        {/* THE FLOW BAR (Sticky Bottom) - Inside Overview */}
        {nextAction && activeTab === 'overview' && totalProgress < 100 && (
            <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
                 <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950"></div>
                 
                 <div className="relative z-10 flex flex-col items-center justify-center pb-12 pt-16 pointer-events-auto">
                    <button 
                        onClick={() => openTask(nextAction.subModuleId, nextAction.taskId)}
                        className="bg-zinc-900 dark:bg-white text-white dark:text-black h-14 px-10 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-4 group"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Action Requise</span>
                            <span className="text-base font-bold">{nextAction.taskTitle}</span>
                        </div>
                        <div className="w-8 h-8 bg-white dark:bg-black rounded-full flex items-center justify-center text-black dark:text-white group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                 </div>
            </div>
        )}

    </div>
  );
};

// Helper component for check icon
const CheckCircleIcon = () => (
    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
        <Check size={12} className="text-white" />
    </div>
);

export default PhaseDetail;