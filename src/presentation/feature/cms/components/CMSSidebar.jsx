import React from 'react';
import { cn } from '@core/utils/cn';

/**
 * CMSSidebar: Internal navigation for CMS modules.
 * Follows SRP: Only handles management module selection.
 */
export const CMSSidebar = ({ sections, activeSection, onSectionChange }) => {
    return (
        <div className="w-72 border-r border-white/5 bg-background flex flex-col p-6">
            <div className="mb-8">
                <h3 className="text-[10px] uppercase tracking-widest text-text-muted/50 font-black mb-6 px-2">Management Modules</h3>
                <div className="space-y-[7px]">
                    {sections.map((section) => (
                        <button
                            key={section.name}
                            onClick={() => onSectionChange(section.name)}
                            className={cn(
                                "w-full flex items-center justify-between py-1.5 px-2 transition-all duration-300 group relative",
                                activeSection === section.name 
                                    ? "text-white" 
                                    : "text-text-muted hover:text-text-primary"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-bold tracking-tight",
                                activeSection === section.name && "underline decoration-[1px] underline-offset-4 decoration-white/80"
                            )}>
                                {section.name}
                            </span>
                            <span className={cn(
                                "text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors",
                                activeSection === section.name 
                                    ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary" 
                                    : "bg-white/5 border-white/5 text-text-muted/50 group-hover:text-accent-primary"
                            )}>
                                {section.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/10">
                    <h4 className="text-[10px] font-bold text-accent-primary uppercase mb-1">System Health</h4>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-2">
                        <div className="bg-accent-primary h-full w-[84%]" />
                    </div>
                    <p className="text-[9px] text-text-muted leading-relaxed">Storage: 42.8GB of 500GB used</p>
                </div>
            </div>
        </div>
    );
};
