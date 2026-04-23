import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';
import { ChevronDown, X } from 'lucide-react';

/**
 * CMSMobileNav: A responsive dropdown navigation for tablets and mobile devices.
 * Shown when the main left CMSSidebar is hidden (< lg breakpoint).
 */
export const CMSMobileNav = ({ sections, activeSection }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Find current section data to display its name
    const currentSection = sections.find(s => s.name === activeSection) || sections[0];

    return (
        <div className="lg:hidden mb-4 mx-4 relative z-40">
            {/* Dropdown Toggle Button */}
            <button 
                onClick={toggleMenu}
                className="w-full flex items-center justify-between p-4 bg-surface rounded-2xl border border-border-subtle shadow-sm transition-colors hover:border-near-black/20"
            >
                <div className="flex items-center gap-3">
                    {currentSection?.icon && <currentSection.icon size={18} className="text-accent-primary" />}
                    <span className="font-serif font-bold tracking-tight text-near-black text-sm">
                        {currentSection?.name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted/60 mr-2">Repository</span>
                    {isOpen ? <X size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
                </div>
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <>
                    {/* Backdrop for closing when clicking outside */}
                    <div 
                        className="fixed inset-0 z-40 bg-near-black/5 backdrop-blur-[2px]"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-surface rounded-2xl border border-border-default shadow-xl z-50 animation-fade-in">
                        <div className="max-h-[60vh] overflow-y-auto space-y-1 scrollbar-hide">
                            {sections.map((section) => (
                                <Link
                                    key={section.name}
                                    to={`${PATHS.CONTENT_MANAGEMENT}/${section.name.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "w-full flex items-center justify-between py-3 px-4 transition-all duration-200 rounded-xl group",
                                        activeSection === section.name 
                                            ? "bg-near-black text-ivory shadow-md" 
                                            : "text-text-muted hover:bg-surface-sunken hover:text-text-primary"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <section.icon 
                                            size={16} 
                                            className={activeSection === section.name ? "text-ivory" : "text-text-muted/60 group-hover:text-accent-primary transition-colors"} 
                                        />
                                        <span className={cn(
                                            "text-sm tracking-tight",
                                            activeSection === section.name ? "font-serif font-bold" : "font-sans font-medium"
                                        )}>
                                            {section.name}
                                        </span>
                                    </div>
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
                </>
            )}
        </div>
    );
};
