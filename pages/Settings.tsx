import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, Monitor } from 'lucide-react';
import { ClientData } from '../types';
import { DEFAULT_CLIENT_DATA } from '../constants';
import { resetClientData } from '../services/storage';

interface SettingsProps {
  clientData: ClientData;
  updateClientData: (data: ClientData) => void;
}

const Settings: React.FC<SettingsProps> = ({ clientData, updateClientData }) => {
  const [formData, setFormData] = useState<ClientData>(clientData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(clientData);
  }, [clientData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClientData(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Attention : Vous allez effacer tout l'avancement et les données. Continuer ?")) {
        resetClientData();
        updateClientData(DEFAULT_CLIENT_DATA);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Paramètres</h2>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-subtle">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Nom du Projet
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="clientDomain" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Domaine / URL
            </label>
            <div className="flex items-center">
                 <span className="bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-800 rounded-l-lg px-3 py-3 text-zinc-500 text-sm">https://</span>
                <input
                type="text"
                id="clientDomain"
                name="clientDomain"
                value={formData.clientDomain}
                onChange={handleChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-r-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                />
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
             <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-red-500 hover:text-red-600 text-sm flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Reset Data
            </button>

            <button
              type="submit"
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90 shadow-lg shadow-zinc-500/10"
            >
              {saved ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
              {saved ? 'Enregistré' : 'Sauvegarder'}
            </button>
          </div>

        </form>
      </div>

      <div className="mt-8 p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
        <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg shadow-sm">
            <Monitor size={20} className="text-zinc-500" />
        </div>
        <div>
            <h4 className="text-zinc-900 dark:text-white font-medium mb-1">Mode de livraison</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Ce dossier est 100% local. Pour le livrer à votre client, envoyez simplement le dossier complet. 
                Il pourra l'ouvrir dans son navigateur sans installation.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;