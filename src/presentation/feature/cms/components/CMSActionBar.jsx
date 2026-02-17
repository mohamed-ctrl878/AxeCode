import React from 'react';
import { ChevronLeft, Database } from 'lucide-react';

/**
 * CMSActionBar: Top navigation and status bar for Focus Mode.
 */
export const CMSActionBar = ({ onExit }) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <button 
                onClick={onExit}
                className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-all group"
            >
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-accent-primary/30 group-hover:bg-accent-primary/5 transition-all">
                    <ChevronLeft size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Exit Management</span>
            </button>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                    SYSTEM OPERATIONAL
                </div>
                <div className="flex items-center gap-2 text-accent-primary/50 mr-4">
                    <Database size={16} />
                    <span className="text-[10px] font-mono tracking-tighter">SECURE MANAGEMENT ACCESS</span>
                </div>
            </div>
        </div>
    );
};
