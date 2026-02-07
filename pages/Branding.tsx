import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClientData, BrandingAsset, BrandVoice } from '../types';
import { BRANDING_MODULES_META } from '../constants';
import { ExternalLink, Plus, Trash, Palette, Mic2, FolderOpen, ArrowRight, ArrowLeft, Type, Info } from 'lucide-react';

interface BrandingProps {
  clientData: ClientData;
  updateClientData: (data: ClientData) => void;
}

const Branding: React.FC<BrandingProps> = ({ clientData, updateClientData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('module');

  // --- Helper Functions ---
  const setActiveModule = (moduleId: string | null) => {
      if (moduleId) {
          setSearchParams({ module: moduleId });
      } else {
          setSearchParams({});
      }
  };

  const addAsset = (newAsset: Partial<BrandingAsset>) => {
      if(!newAsset.name || !newAsset.value) return;
      const asset: BrandingAsset = {
          id: Date.now().toString(),
          name: newAsset.name,
          value: newAsset.value,
          type: newAsset.type as any
      };
      updateClientData({
          ...clientData,
          branding: [...(clientData.branding || []), asset]
      });
  };

  const removeAsset = (id: string) => {
      updateClientData({
          ...clientData,
          branding: clientData.branding.filter(b => b.id !== id)
      });
  };

  const updateVoice = (field: keyof BrandVoice, value: string) => {
      updateClientData({
          ...clientData,
          brandVoice: { ...clientData.brandVoice, [field]: value }
      });
  };

  const getIcon = (iconName: string) => {
      if (iconName === 'Palette') return Palette;
      if (iconName === 'Mic2') return Mic2;
      if (iconName === 'FolderOpen') return FolderOpen;
      return Palette;
  };

  // --- RENDER: MAIN DASHBOARD (Cards) ---
  if (!activeModule) {
      return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <header className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Brand Brainbook</h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl">
                    L'ADN de votre marque. Ces éléments assurent la cohérence sur tous les canaux.
                </p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BRANDING_MODULES_META.map(module => {
                    const Icon = getIcon(module.iconName);
                    return (
                        <div 
                            key={module.id}
                            onClick={() => setActiveModule(module.id)}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{module.title}</h3>
                            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{module.description}</p>
                            
                            <div className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                Ouvrir le module <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    )
                })}
             </div>
          </div>
      );
  }

  // --- RENDER: MODULE DETAIL ---
  const currentModuleDef = BRANDING_MODULES_META.find(m => m.id === activeModule);
  const CurrentModuleIcon = currentModuleDef ? getIcon(currentModuleDef.iconName) : Palette;

  return (
      <div className="animate-in slide-in-from-right-4 duration-300 min-h-screen">
         <button 
            onClick={() => setActiveModule(null)}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
         >
             <ArrowLeft size={16} /> Retour au Brainbook
         </button>

         <header className="flex items-center justify-between mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-6">
             <div className="flex items-center gap-4">
                 <div className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl">
                    <CurrentModuleIcon size={24} />
                 </div>
                 <div>
                     <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{currentModuleDef?.title}</h2>
                     <p className="text-sm text-zinc-500">{currentModuleDef?.description}</p>
                 </div>
             </div>
         </header>

         {/* --- MODULE CONTENT: VISUAL IDENTITY --- */}
         {activeModule === 'visual' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Colors Section */}
                 <div className="space-y-6">
                     <h3 className="font-semibold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                        <Palette size={18} /> Palette de Couleurs
                     </h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {clientData.branding?.filter(b => b.type === 'color').map(asset => (
                            <div key={asset.id} className="group relative bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <button onClick={() => removeAsset(asset.id)} className="absolute top-1 right-1 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={12} /></button>
                                <div className="w-full h-16 rounded-lg mb-3 shadow-inner" style={{ backgroundColor: asset.value }}></div>
                                <p className="font-medium text-zinc-900 dark:text-white text-xs truncate">{asset.name}</p>
                                <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase cursor-pointer hover:text-zinc-900" onClick={() => navigator.clipboard.writeText(asset.value)}>{asset.value}</p>
                            </div>
                        ))}
                         <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center h-[140px] gap-2">
                             <div className="text-xs font-medium text-zinc-400">Ajouter</div>
                             <input type="color" className="w-8 h-8 rounded cursor-pointer" onChange={(e) => addAsset({ name: 'Nouvelle', value: e.target.value, type: 'color' })} />
                        </div>
                     </div>
                 </div>

                 {/* Typography Section */}
                 <div className="space-y-6">
                     <h3 className="font-semibold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                        <Type size={18} /> Typographie
                     </h3>
                     <div className="space-y-3">
                        {clientData.branding?.filter(b => b.type === 'text').map(asset => (
                             <div key={asset.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center group">
                                 <div>
                                     <p className="text-xs text-zinc-400 uppercase mb-1">{asset.name}</p>
                                     <p className="text-xl font-medium text-zinc-900 dark:text-white" style={{ fontFamily: asset.value }}>{asset.value}</p>
                                 </div>
                                 <button onClick={() => removeAsset(asset.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash size={16} /></button>
                             </div>
                        ))}
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                placeholder="Nom (ex: Titres)" 
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none"
                                id="fontName"
                            />
                            <input 
                                type="text" 
                                placeholder="Famille (ex: Inter)" 
                                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none"
                                id="fontFamily"
                            />
                            <button 
                                onClick={() => {
                                    const name = (document.getElementById('fontName') as HTMLInputElement).value;
                                    const val = (document.getElementById('fontFamily') as HTMLInputElement).value;
                                    addAsset({ name, value: val, type: 'text' });
                                    (document.getElementById('fontName') as HTMLInputElement).value = '';
                                    (document.getElementById('fontFamily') as HTMLInputElement).value = '';
                                }}
                                className="bg-zinc-900 dark:bg-white text-white dark:text-black p-2 rounded-lg"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                     </div>
                 </div>
             </div>
         )}

         {/* --- MODULE CONTENT: BRAND VOICE --- */}
         {activeModule === 'voice' && (
             <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
                 <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                     <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Ton & Style</label>
                     <p className="text-xs text-zinc-500 mb-3">Comment la marque s'exprime-t-elle ? (ex: Professionnel mais accessible, Direct, Humoristique...)</p>
                     <textarea 
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-y min-h-[100px]"
                        value={clientData.brandVoice?.tone || ''}
                        onChange={(e) => updateVoice('tone', e.target.value)}
                        placeholder="Définissez le ton ici..."
                     />
                 </div>

                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                     <label className="block text-sm font-bold text-zinc-900 dark:text-white mb-2">Archétype</label>
                     <p className="text-xs text-zinc-500 mb-3">Quel personnage représente la marque ? (ex: Le Sage, Le Rebelle, Le Créateur)</p>
                     <input 
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        value={clientData.brandVoice?.archetype || ''}
                        onChange={(e) => updateVoice('archetype', e.target.value)}
                        placeholder="Ex: Le Guide Bienveillant"
                     />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <label className="block text-sm font-bold text-green-600 mb-2">Vocabulaire Clé (Do's)</label>
                        <textarea 
                            className="w-full bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg p-3 text-sm focus:outline-none resize-none h-[150px]"
                            value={clientData.brandVoice?.vocabulary || ''}
                            onChange={(e) => updateVoice('vocabulary', e.target.value)}
                            placeholder="Mots à privilégier..."
                        />
                     </div>
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <label className="block text-sm font-bold text-red-600 mb-2">À Éviter (Don'ts)</label>
                        <textarea 
                            className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3 text-sm focus:outline-none resize-none h-[150px]"
                            value={clientData.brandVoice?.forbidden || ''}
                            onChange={(e) => updateVoice('forbidden', e.target.value)}
                            placeholder="Mots interdits..."
                        />
                     </div>
                 </div>
             </div>
         )}

         {/* --- MODULE CONTENT: ASSETS --- */}
         {activeModule === 'assets' && (
             <div className="max-w-4xl mx-auto space-y-6">
                 <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-4 items-center">
                     <Info className="text-zinc-400" size={20} />
                     <p className="text-sm text-zinc-500">Stockez ici les liens vers vos dossiers Google Drive, Figma, ou Notion contenant vos logos et images.</p>
                 </div>

                 <div className="space-y-3">
                    {clientData.branding?.filter(b => b.type === 'link').map(asset => (
                        <div key={asset.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <ExternalLink size={20} className="text-zinc-600 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-white">{asset.name}</p>
                                    <a href={asset.value} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[300px] block">{asset.value}</a>
                                </div>
                            </div>
                            <button onClick={() => removeAsset(asset.id)} className="text-zinc-400 hover:text-red-500 p-2"><Trash size={18} /></button>
                        </div>
                    ))}
                 </div>

                 <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mt-6">
                    <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Ajouter un lien</h4>
                    <div className="flex flex-col md:flex-row gap-3">
                        <input 
                            type="text" 
                            placeholder="Nom (ex: Logo Drive)" 
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black"
                            id="linkName"
                        />
                         <input 
                            type="text" 
                            placeholder="https://..." 
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black"
                            id="linkUrl"
                        />
                         <button 
                            onClick={() => {
                                const name = (document.getElementById('linkName') as HTMLInputElement).value;
                                const val = (document.getElementById('linkUrl') as HTMLInputElement).value;
                                addAsset({ name, value: val, type: 'link' });
                                (document.getElementById('linkName') as HTMLInputElement).value = '';
                                (document.getElementById('linkUrl') as HTMLInputElement).value = '';
                            }}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 justify-center"
                        >
                            <Plus size={16} /> Ajouter
                        </button>
                    </div>
                 </div>
             </div>
         )}
      </div>
  );
};

export default Branding;