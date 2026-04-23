import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

/**
 * CMSSidebar: Internal navigation for CMS modules.
 * Follows SRP: Only handles management module selection.
 */
export const CMSSidebar = ({ sections, activeSection }) => {
    return (
        <div className="hidden lg:block w-72 border-r border-border-subtle bg-surface shrink-0">
            <div className="flex flex-col p-8 sticky top-8 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
                <div className="mb-10">
                    <h3 className="text-[11px] uppercase tracking-[0.25em] text-text-muted/60 font-serif font-bold mb-8 px-2">
                        Repository Index
                    </h3>
                    <div className="space-y-1">
                        {sections.map((section) => (
                            <Link
                                key={section.name}
                                to={`${PATHS.CONTENT_MANAGEMENT}/${section.name.toLowerCase()}`}
                                className={cn(
                                    "w-full flex items-center justify-between py-2.5 px-3 transition-all duration-300 group rounded-xl",
                                    activeSection === section.name 
                                        ? "bg-near-black text-ivory shadow-lg" 
                                        : "text-text-muted hover:bg-surface-sunken hover:text-text-primary"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-medium tracking-tight",
                                    activeSection === section.name ? "font-serif" : "font-sans"
                                )}>
                                    {section.name}
                                </span>
                                <span className={cn(
                                    "text-[9px] font-mono px-2 py-0.5 rounded-full border transition-colors",
                                    activeSection === section.name 
                                        ? "bg-ivory/20 border-ivory/20 text-ivory" 
                                        : "bg-surface-elevated border-border-subtle text-text-muted/50 group-hover:text-accent-primary"
                                )}>
                                    {section.count}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="p-5 rounded-2xl bg-parchment border border-border-default shadow-whisper">
                        <h4 className="text-[10px] font-bold text-near-black font-serif uppercase tracking-widest mb-3">
                            Storage Vault
                        </h4>
                        <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden mb-3">
                            <div className="bg-near-black h-full w-[84%]" />
                        </div>
                        <p className="text-[9px] text-text-muted leading-relaxed">
                            Capacity used: <span className="text-near-black font-bold">42.8 GB</span> of 500 GB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
