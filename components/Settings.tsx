
import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database, FileJson, RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export const Settings: React.FC<Props> = ({ onExport, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Database className="text-slate-400" /> Data Management
            </h2>
            <p className="text-slate-400 text-sm mt-1">
                Manage your local data. Use Export/Import to sync data manually between devices.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup & Sync */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileJson size={20} className="text-indigo-400" /> Backup & Sync
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Your data is currently stored in your browser's local storage. To move data to another device (like between yours and your wife's laptop), export it here and import it on the other device.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={onExport}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
                    >
                        <Download size={18} /> Export Data to JSON
                    </button>

                    <div className="relative">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                        >
                            <Upload size={18} /> Import Data from JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-slate-900 border border-rose-900/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
                
                <h3 className="text-lg font-semibold text-rose-400 mb-4 flex items-center gap-2 relative z-10">
                    <AlertTriangle size={20} /> Danger Zone
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed relative z-10">
                    This will wipe all your custom cards, subscriptions, and settings, reverting the app to the initial demo state. This action cannot be undone unless you have an exported backup.
                </p>

                <button 
                    onClick={() => {
                        if(confirm("Are you sure you want to wipe all data and reset to the demo state? This cannot be undone.")) {
                            onReset();
                        }
                    }}
                    className="w-full bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 hover:text-rose-300 border border-rose-900/50 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors relative z-10"
                >
                    <RefreshCcw size={18} /> Reset to Demo Data
                </button>
            </div>
        </div>
    </div>
  );
};
