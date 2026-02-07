import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Rocket, 
  Palette, 
  ChevronRight,
  Lock,
  CheckCircle2,
  Menu,
  X,
  ArrowLeft,
  Fingerprint,
  Mic2,
  FolderOpen
} from 'lucide-react';
import { ClientData, FrameworkPhase } from '../types';
import { FRAMEWORK_DATA, BRANDING_MODULES_META } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  clientData: ClientData;
}

const Layout: React.FC<LayoutProps> = ({ children, clientData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Check if we are inside a specific phase detail view (or identity module)
  const currentPhaseId = location.pathname.match(/\/phase\/([^/]+)/)?.[1];
  const currentPhase = FRAMEWORK_DATA.find(p => p.id === currentPhaseId);
  const isPhaseView = !!currentPhase;
  const isBrandingView = location.pathname === '/branding';

  // Extract current tab from URL query params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');
  const activeBrandingModule = searchParams.get('module');

  // Calculate progress for a phase
  const getPhaseProgress = (phase: FrameworkPhase) => {
    // Identity is special
    if (phase.id === 'identity') {
        let score = 0;
        if (clientData.clientDomain) score += 33;
        if (clientData.identity.mission) score += 34;
        if (clientData.identity.selectedDomainPrefix) score += 33;
        return score;
    }

    // STRICT PROGRESS CALCULATION: Only Sub-module tasks count
    let totalItems = 0;
    let completedCount = 0;

    if (phase.subModules && phase.subModules.length > 0) {
        phase.subModules.forEach(sub => {
            totalItems += sub.tasks.length;
            completedCount += sub.tasks.filter(t => clientData.completedItems.includes(`${phase.id}-${sub.id}-${t.id}`)).length;
        });
    }

    // Avoid division by zero if a module has no tasks yet
    if (totalItems === 0) return 0;
    
    return Math.round((completedCount / totalItems) * 100);
  };

  const handleTabNavigation = (tab: string) => {
      if (currentPhaseId) {
          navigate(`/phase/${currentPhaseId}?tab=${tab}`);
      }
  };

  const handleBrandingNavigation = (moduleId: string | null) => {
      if (moduleId) {
          navigate(`/branding?module=${moduleId}`);
      } else {
          navigate('/branding');
      }
  };

  // Helper to get icon for branding
  const getBrandingIcon = (iconName: string) => {
      if (iconName === 'Palette') return <Palette size={14} />;
      if (iconName === 'Mic2') return <Mic2 size={14} />;
      if (iconName === 'FolderOpen') return <FolderOpen size={14} />;
      return <Palette size={14} />;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* 1. PRIMARY RAIL SIDEBAR (Always Visible on Desktop) */}
      <aside className="hidden md:flex w-20 flex-col items-center py-6 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 z-30 fixed h-full left-0 top-0">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-8 shadow-lg">
           <Rocket size={20} />
        </div>

        <nav className="flex flex-col gap-4 w-full px-2">
            <Link to="/" className={`p-3 rounded-xl flex justify-center transition-all ${location.pathname === '/' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
                <LayoutDashboard size={22} />
            </Link>
            <Link to="/branding" className={`p-3 rounded-xl flex justify-center transition-all ${location.pathname === '/branding' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
                <Palette size={22} />
            </Link>
             <Link to="/settings" className={`p-3 rounded-xl flex justify-center transition-all ${location.pathname === '/settings' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
                <Settings size={22} />
            </Link>
        </nav>
      </aside>

      {/* 2. SECONDARY CONTEXT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 fixed h-full left-20 top-0 z-20">
        
        {/* Header of Secondary Sidebar */}
        <div className="h-20 border-b border-zinc-100 dark:border-zinc-900 flex flex-col justify-center px-6">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                {isPhaseView ? (currentPhase?.type === 'setup' ? 'Configuration' : 'Module Actif') : (isBrandingView ? 'Brand OS' : 'Espace Client')}
            </p>
            <h2 className="font-semibold text-zinc-900 dark:text-white truncate">
                {isPhaseView ? currentPhase?.title : (isBrandingView ? 'Brainbook' : clientData.clientName || 'Projet Sans Nom')}
            </h2>
        </div>

        {/* Content of Secondary Sidebar */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
            
            {/* SCENARIO 1: PHASE DETAILS */}
            {isPhaseView && (
                <div className="space-y-6">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2">
                        <ArrowLeft size={14} /> Vue d'ensemble
                    </button>
                    
                    <div className="space-y-1">
                        <div className="px-2 pb-2 text-xs font-semibold text-zinc-400">Progression du module</div>
                         <div className="px-2">
                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-black dark:bg-white transition-all duration-500"
                                    style={{ width: `${currentPhase ? getPhaseProgress(currentPhase) : 0}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-right text-xs font-mono text-zinc-500">
                                {currentPhase ? getPhaseProgress(currentPhase) : 0}%
                            </div>
                         </div>
                    </div>

                    <div className="space-y-1">
                        <div className="px-2 pb-2 text-xs font-semibold text-zinc-400">Navigation Rapide</div>
                        <button 
                            onClick={() => handleTabNavigation('overview')} 
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                !currentTab || currentTab === 'overview'
                                ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white' 
                                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                        >
                            Vue d'ensemble
                        </button>
                        <button 
                             onClick={() => handleTabNavigation('checklist')}
                             className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                currentTab === 'checklist'
                                ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white' 
                                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                        >
                            Modules & Ressources
                        </button>
                        <button 
                             onClick={() => handleTabNavigation('resources')}
                             className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                currentTab === 'resources'
                                ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white' 
                                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                        >
                            Aide & Informations
                        </button>
                    </div>
                </div>
            )}

            {/* SCENARIO 2: BRANDING VIEW */}
            {isBrandingView && (
                <div className="space-y-8">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2">
                        <ArrowLeft size={14} /> Dashboard Principal
                    </button>

                    <div className="space-y-1">
                        <div className="px-2 pb-2 text-xs font-semibold text-zinc-400">Brand Assets</div>
                        {BRANDING_MODULES_META.map(module => (
                            <button 
                                key={module.id}
                                onClick={() => handleBrandingNavigation(module.id)}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-3 ${
                                    activeBrandingModule === module.id
                                    ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white' 
                                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                {getBrandingIcon(module.iconName)}
                                {module.title}
                            </button>
                        ))}
                    </div>
                    
                    {activeBrandingModule && (
                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                             <button 
                                onClick={() => handleBrandingNavigation(null)}
                                className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                             >
                                 ← Retour Menu
                             </button>
                        </div>
                    )}
                </div>
            )}

            {/* SCENARIO 3: GLOBAL DASHBOARD (Default) */}
            {!isPhaseView && !isBrandingView && (
                <div className="space-y-8">
                    <div className="space-y-1">
                        <div className="px-2 pb-2 text-xs font-semibold text-zinc-400">Modules Système</div>
                        {FRAMEWORK_DATA.map(phase => {
                             const isUnlocked = clientData.unlockedPhases.includes(phase.id);
                             const progress = getPhaseProgress(phase);
                             
                             return (
                                <button
                                    key={phase.id}
                                    onClick={() => isUnlocked && navigate(`/phase/${phase.id}?tab=overview`)}
                                    disabled={!isUnlocked}
                                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between group transition-all ${
                                        isUnlocked 
                                        ? 'hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer' 
                                        : 'opacity-50 cursor-not-allowed'
                                    } ${clientData.activePhaseId === phase.id ? 'bg-zinc-100 dark:bg-zinc-900' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {phase.id === 'identity' ? (
                                             <Fingerprint size={14} className={isUnlocked ? "text-zinc-900 dark:text-white" : "text-zinc-400"} />
                                        ) : isUnlocked ? (
                                            progress === 100 
                                            ? <CheckCircle2 size={16} className="text-zinc-900 dark:text-white" /> 
                                            : <div className="w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-700"></div>
                                        ) : (
                                            <Lock size={14} className="text-zinc-400" />
                                        )}
                                        <span className={`text-sm font-medium ${isUnlocked ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`}>
                                            {phase.title}
                                        </span>
                                    </div>
                                    {isUnlocked && <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500" />}
                                </button>
                             )
                        })}
                    </div>
                </div>
            )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-40 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Rocket size={16} />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">Acquisition OS</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-500">
            {mobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

       {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white dark:bg-zinc-900 z-30 pt-20 px-6 md:hidden">
              <nav className="space-y-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800">Vue d'ensemble</Link>
                <Link to="/branding" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800">Branding</Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-lg font-medium text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800">Paramètres</Link>
              </nav>
          </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[340px] p-6 md:p-12 pt-24 md:pt-12 min-h-screen">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;