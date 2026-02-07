import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FRAMEWORK_DATA } from '../constants';
import PhaseCard from '../components/PhaseCard';
import ObjectiveCard from '../components/ObjectiveCard';
import { ClientData, ObjectivesData } from '../types';
import { X, Lock, KeyRound, Fingerprint } from 'lucide-react';

interface DashboardProps {
  clientData: ClientData;
  updateClientData: (data: ClientData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ clientData, updateClientData }) => {
  const navigate = useNavigate();
  const [unlockModal, setUnlockModal] = useState<{ isOpen: boolean; phaseId: string }>({ isOpen: false, phaseId: '' });
  const [codeAttempt, setCodeAttempt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getPhaseProgress = (phaseId: string) => {
    // Custom progress for identity
    if (phaseId === 'identity') {
        let score = 0;
        if (clientData.clientDomain) score += 33;
        if (clientData.identity.mission) score += 34;
        if (clientData.identity.selectedDomainPrefix) score += 33;
        return score;
    }

    const phase = FRAMEWORK_DATA.find(p => p.id === phaseId);
    if (!phase) return 0;
    
    const total = phase.strategies.length;
    const completed = phase.strategies.filter(s => 
      clientData.completedItems.includes(`${phase.id}-${s}`)
    ).length;
    return Math.round((completed / total) * 100);
  };

  const handleUnlockClick = (phaseId: string) => {
    setUnlockModal({ isOpen: true, phaseId });
    setCodeAttempt('');
    setErrorMsg('');
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    const phase = FRAMEWORK_DATA.find(p => p.id === unlockModal.phaseId);
    
    if (phase && codeAttempt.toUpperCase().trim() === phase.unlockCode) {
      updateClientData({
        ...clientData,
        unlockedPhases: [...clientData.unlockedPhases, phase.id]
      });
      setUnlockModal({ isOpen: false, phaseId: '' });
    } else {
      setErrorMsg("Code incorrect.");
    }
  };

  const updateObjectives = (newObjectives: ObjectivesData) => {
      updateClientData({
          ...clientData,
          objectives: newObjectives
      });
  };

  // Check if Identity is done
  const identityProgress = getPhaseProgress('identity');
  const isIdentityComplete = identityProgress > 90;

  return (
    <div>
      <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                    {clientData.clientName === 'Nouveau Projet' ? 'Initialisation du Projet' : `Projet ${clientData.clientName}`}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl">
                    Base de données centrale pour l'acquisition et le marketing.
                </p>
             </div>
        </div>
      </header>

      {/* Module 0: Identity Highlight */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* LEFT: Identity Card */}
             {FRAMEWORK_DATA.filter(p => p.id === 'identity').map(phase => (
                 <PhaseCard
                    key={phase.id}
                    phase={phase}
                    isUnlocked={true}
                    progress={identityProgress}
                    onUnlock={() => {}}
                    onClick={() => navigate(`/phase/${phase.id}`)}
                />
             ))}
             
             {/* RIGHT: Objectives Card (or Info if locked) */}
             {!isIdentityComplete ? (
                 <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-zinc-900 dark:text-white font-medium mb-2">
                        <Fingerprint size={20} />
                        Commencez ici
                    </div>
                    <p className="text-sm text-zinc-500">
                        Avant de définir vos objectifs financiers, vous devez définir l'identité V1 du business.
                    </p>
                 </div>
             ) : (
                 <ObjectiveCard 
                    objectives={clientData.objectives} 
                    onSave={updateObjectives}
                 />
             )}
        </div>
      </section>

      {/* Execution Modules */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Modules Stratégiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
            {FRAMEWORK_DATA.filter(p => p.id !== 'identity').map((phase) => {
            const isUnlocked = clientData.unlockedPhases.includes(phase.id);
            const progress = getPhaseProgress(phase.id);
            return (
                <PhaseCard
                    key={phase.id}
                    phase={phase}
                    isUnlocked={isUnlocked}
                    progress={progress}
                    onUnlock={() => handleUnlockClick(phase.id)}
                    onClick={() => navigate(`/phase/${phase.id}`)}
                />
            );
            })}
        </div>
      </section>

      {/* Unlock Modal */}
      {unlockModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                          <Lock size={24} className="text-zinc-900 dark:text-white" />
                      </div>
                      <button onClick={() => setUnlockModal({ isOpen: false, phaseId: '' })} className="text-zinc-400 hover:text-zinc-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Accès Module</h3>
                  <p className="text-sm text-zinc-500 mb-6">
                      Code requis pour débloquer cette phase.
                  </p>

                  <form onSubmit={submitCode}>
                      <div className="relative mb-4">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                          <input 
                            type="text" 
                            autoFocus
                            value={codeAttempt}
                            onChange={(e) => setCodeAttempt(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono uppercase"
                            placeholder="CODE"
                          />
                      </div>
                      {errorMsg && <p className="text-red-500 text-xs mb-4">{errorMsg}</p>}
                      
                      <button 
                        type="submit"
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                      >
                          Valider
                      </button>
                  </form>
              </div>
          </div>
      )}

      <footer className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
         <p>Marketing Brain OS v2.1 (Modular)</p>
      </footer>
    </div>
  );
};

export default Dashboard;