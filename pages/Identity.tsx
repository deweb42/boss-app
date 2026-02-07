import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientData } from '../types';
import { Fingerprint, Globe, Flag, Save, RefreshCw } from 'lucide-react';
import { FRAMEWORK_DATA } from '../constants';

interface IdentityProps {
  clientData: ClientData;
  updateClientData: (data: ClientData) => void;
}

const Identity: React.FC<IdentityProps> = ({ clientData, updateClientData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(clientData);
  const [saved, setSaved] = useState(false);
  const phase = FRAMEWORK_DATA.find(p => p.id === 'identity');

  useEffect(() => {
    setFormData(clientData);
  }, [clientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Check if field belongs to identity object or root clientData
    if (['mission', 'targetAudienceSummary', 'selectedDomainPrefix'].includes(name)) {
        setFormData(prev => ({
            ...prev,
            identity: { ...prev.identity, [name]: value }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    setSaved(false);
  };

  const handleDomainSelect = (prefix: string) => {
      setFormData(prev => ({
          ...prev,
          identity: { ...prev.identity, selectedDomainPrefix: prefix }
      }));
      setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    
    // Unlock next phase if Identity is filled enough
    let nextUnlocked = [...formData.unlockedPhases];
    if (formData.clientName && formData.clientDomain && !nextUnlocked.includes('offre')) {
        nextUnlocked.push('offre');
    }

    const newData = {
        ...formData,
        unlockedPhases: nextUnlocked,
        activePhaseId: 'offre' // Automatically set next phase active
    };

    updateClientData(newData);

    // Redirect to Offer module after short delay
    setTimeout(() => {
        setSaved(false);
        if (formData.clientName && formData.clientDomain) {
            navigate('/phase/offre');
        }
    }, 1000);
  };

  if (!phase) return null;

  return (
    <div className="space-y-12">
       {/* Header Section */}
       <div id="overview" className="border-b border-zinc-100 dark:border-zinc-800 pb-8">
             <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full uppercase tracking-wider">
                     {phase.subtitle} · {formData.identity.version}
                 </span>
             </div>
             <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-6">Identité du Projet</h1>
             <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light max-w-3xl leading-relaxed">
                 {phase.goal} Cette section est la "Single Source of Truth" pour tous les futurs modules d'IA et de stratégie.
             </p>
        </div>

        <form onSubmit={handleSubmit} id="strategy" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
                {/* 1. Project Basics */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-subtle">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <Flag size={20} className="text-zinc-900 dark:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Les Fondations</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Nom du Projet / Client</label>
                            <input 
                                type="text" 
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                placeholder="Ex: Acme Agency"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Pourquoi ce projet ? (Mission)</label>
                            <textarea 
                                name="mission"
                                value={formData.identity.mission}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Décrivez la raison d'être profonde du business. C'est ce que nous utiliserons pour aligner le copy."
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Technical Identity (Domains) */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-subtle">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <Globe size={20} className="text-zinc-900 dark:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Infrastructure Digitale</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Domaine Principal (Racine)</label>
                            <input 
                                type="text" 
                                name="clientDomain"
                                value={formData.clientDomain}
                                onChange={handleChange}
                                placeholder="mondomaine.com"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all font-mono"
                            />
                        </div>

                        {formData.clientDomain && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Choisissez votre extension d'acquisition</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['go', 'get', 'app', 'start'].map(prefix => (
                                        <div 
                                            key={prefix}
                                            onClick={() => handleDomainSelect(prefix)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                formData.identity.selectedDomainPrefix === prefix
                                                ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-black shadow-lg'
                                                : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                                            }`}
                                        >
                                            <span className="font-mono text-sm">{prefix}.{formData.clientDomain}</span>
                                            {formData.identity.selectedDomainPrefix === prefix && <div className="w-2 h-2 rounded-full bg-white dark:bg-black"></div>}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">
                                    Nous recommandons <strong>go.{formData.clientDomain}</strong> pour les landing pages marketing directes.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel: Save & Info */}
            <div className="space-y-6">
                 <div className="sticky top-8 space-y-6">
                    <button
                        type="submit"
                        className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg shadow-xl shadow-zinc-500/10 hover:shadow-zinc-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        {saved ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {saved ? 'Sauvegardé !' : 'Sauvegarder et Continuer'}
                    </button>

                    <div id="assets" className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-3">
                            <Fingerprint size={18} className="text-zinc-500" />
                            <h4 className="font-semibold text-zinc-900 dark:text-white">Pourquoi cette étape ?</h4>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Ceci n'est pas juste un formulaire. C'est la base de données qui servira de contexte pour tous les prompts IA que nous utiliserons dans les modules suivants (Offre, Contenu, etc.).
                        </p>
                    </div>
                 </div>
            </div>

        </form>
    </div>
  );
};

export default Identity;