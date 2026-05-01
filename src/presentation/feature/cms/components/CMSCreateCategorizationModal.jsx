import React, { useState } from 'react';
import { X, Loader2, Save, Tag, Type } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * Premium Modal for creating new categorization tracks (Course/Problem types).
 */
export const CMSCreateCategorizationModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    modalHeader = "New Track", 
    isLoading = false 
}) => {
    const [title, setTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-near-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-ivory border border-border-default rounded-3xl md:rounded-[40px] shadow-2xl overflow-hidden animation-modal-in">
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-border-default bg-parchment/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-near-black flex items-center justify-center text-ivory shadow-lg">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-near-black">{modalHeader}</h2>
                            <p className="text-[10px] text-text-muted font-serif uppercase tracking-[0.2em] mt-1 opacity-60">Append new taxonomy node</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-surface-sunken hover:text-near-black transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 flex items-center gap-2">
                                <Type size={12} /> Identifier Label
                             </label>
                             <input 
                                required
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full h-14 px-6 bg-white border border-border-default rounded-2xl font-serif text-sm focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all shadow-sm"
                                placeholder="e.g. Advanced Calculus, Backend Systems..."
                             />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border border-border-default text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-surface-sunken transition-all"
                        >
                            Retract
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading || !title}
                            className="flex-[2] h-14 bg-near-black text-ivory rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Log to Ledger
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
