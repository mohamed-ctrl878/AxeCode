import React from 'react';
import { ChevronLeft, Library } from 'lucide-react';
import AxeCodeLogo from '@presentation/shared/components/AxeCodeLogo';

/**
 * CMSActionBar: Top navigation and status bar for Focus Mode.
 */
export const CMSActionBar = ({ onExit }) => {
    return (
        <div className="flex items-center justify-between mb-8 px-2">
            <button 
                onClick={onExit}
                className="flex items-center gap-3 text-text-muted hover:text-text-primary transition-all group"
            >
                <div className="w-10 h-10 rounded-full border border-border-default flex items-center justify-center group-hover:border-text-primary group-hover:bg-text-primary group-hover:text-surface transition-all shadow-sm">
                    <ChevronLeft size={18} />
                </div>
                <span className="text-xs font-serif font-bold uppercase tracking-[0.2em]">Close Archive</span>
            </button>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border-default text-[10px] font-serif font-bold uppercase tracking-widest text-text-primary shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-primary" />
                    Archive Active
                </div>
                
                <div className="flex items-center gap-3 pr-2">
                    <Library size={16} className="text-text-muted" />
                    <AxeCodeLogo isCollapsed={true} size="text-sm" />
                </div>
            </div>
        </div>
    );
};
