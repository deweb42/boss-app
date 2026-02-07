import React, { useState } from 'react';
import { Target, Calendar, BarChart3, Heart, Edit2, Save, X } from 'lucide-react';
import { ObjectivesData } from '../types';

interface ObjectiveCardProps {
  objectives: ObjectivesData;
  onSave: (data: ObjectivesData) => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({ objectives, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ObjectivesData>(objectives);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const isEmpty = !objectives.smartGoal;

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Target size={20} className="text-zinc-900 dark:text-white" />
                Définir le Cap
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Objectif S.M.A.R.T</label>
                <input 
                    name="smartGoal" 
                    value={formData.smartGoal} 
                    onChange={handleChange} 
                    placeholder="Ex: 100k€ ARR, 50 Clients..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Échéance</label>
                <input 
                    name="deadline" 
                    value={formData.deadline} 
                    onChange={handleChange} 
                    placeholder="Ex: 6 mois, 31 Décembre..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Situation Actuelle</label>
                <input 
                    name="currentSituation" 
                    value={formData.currentSituation} 
                    onChange={handleChange} 
                    placeholder="Ex: 0€, Lancement..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">La Raison (Why)</label>
                <textarea 
                    name="motivation" 
                    value={formData.motivation} 
                    onChange={handleChange} 
                    rows={2}
                    placeholder="Pourquoi est-ce crucial ?"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white resize-none"
                />
            </div>
        </div>

        <button 
            onClick={handleSave}
            className="w-full mt-6 bg-zinc-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
        >
            <Save size={16} /> Enregistrer l'Objectif
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-full flex flex-col justify-between relative group hover:shadow-card transition-all">
        <button 
            onClick={() => setIsEditing(true)} 
            className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
            <Edit2 size={16} />
        </button>

        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <Target size={20} className="text-zinc-900 dark:text-white" />
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">North Star</h3>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center text-center py-4 opacity-60">
                    <p className="text-sm text-zinc-500 mb-4">Aucun objectif défini.</p>
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold underline">Définir le cap</button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Objectif</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">{objectives.smartGoal}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                                <Calendar size={12} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">Délai</span>
                            </div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{objectives.deadline}</p>
                        </div>
                        <div>
                             <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                                <BarChart3 size={12} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">Départ</span>
                            </div>
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{objectives.currentSituation}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                            <Heart size={12} />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">Motivation</span>
                        </div>
                         <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">"{objectives.motivation}"</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ObjectiveCard;