import React from 'react';
import { Search, Bell, MessageSquare, User, Menu, Command } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useUI } from '../../provider/UIProvider';

/**
 * Header: Global navigation and action bar.
 * Features: Adaptive search, notification badges, and user profile management.
 */
export const Header = () => {
    const { isSidebarOpen } = useUI();

    return (
        <header className={cn(
            "fixed top-0 right-0 h-16 glass border-b border-border-subtle z-40 transition-all duration-500 flex items-center px-4 md:px-6 justify-between",
            "left-0 md:left-20",
            isSidebarOpen && "md:left-64"
        )}>

            {/* Search Section */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for courses, problems, or events..." 
                        className="w-full bg-surface-dark/50 border border-border-subtle rounded-xl py-2 pl-10 pr-12 text-sm focus:border-accent-primary outline-none transition-all placeholder:text-text-muted/50 focus:bg-surface-dark"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-border-subtle/50 px-1.5 py-0.5 rounded border border-white/5">
                        <Command size={10} className="text-text-muted" />
                        <span className="text-[10px] font-mono text-text-muted">K</span>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                {/* Messages */}
                <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-dark rounded-xl transition-all group">
                    <MessageSquare size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full border-2 border-background glow-pulse" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-dark rounded-xl transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border-subtle mx-2" />

                {/* Profile Toggle */}
                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-xs font-bold text-text-primary">Mohamed El-Hussainy</span>
                        <span className="text-[10px] text-accent-primary font-mono tracking-tighter">PREMIUM MEMBER</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-emerald-800 p-[1px]">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            <img 
                                src="https://ui-avatars.com/api/?name=Mohamed+ElHussainy&background=0D0D0D&color=34d399" 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
};
