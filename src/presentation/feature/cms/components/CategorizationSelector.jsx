import React, { useState, useEffect } from 'react';
import { Tag, Check, ChevronDown, Search, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * Premium Multi-Selector for Categorization Tracks (Course/Problem types).
 * Designed for CMN forms.
 */
export const CategorizationSelector = ({ 
    label = "Classification", 
    availableItems = [], 
    selectedIds = [], 
    onChange,
    isLoading = false,
    placeholder = "Select tracks..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = availableItems.filter(item => 
        (item.title || item.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleItem = (id) => {
        const newSelection = selectedIds.includes(id)
            ? selectedIds.filter(i => i !== id)
            : [...selectedIds, id];
        onChange(newSelection);
    };

    const selectedItems = availableItems.filter(item => selectedIds.includes(item.documentId || item.id));

    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 flex items-center gap-2">
                <Tag size={12} /> {label}
            </label>
            
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "min-h-[56px] w-full px-4 py-3 bg-surface-sunken/40 border border-border-subtle rounded-xl flex flex-wrap gap-2 cursor-pointer transition-all hover:bg-surface-sunken/60",
                    isOpen && "ring-2 ring-accent-primary/20 border-accent-primary/40"
                )}
            >
                {selectedItems.length > 0 ? (
                    selectedItems.map(item => (
                        <div 
                            key={item.documentId || item.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-primary text-ivory rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm animation-fade-in"
                        >
                            {item.title || item.type}
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.documentId || item.id);
                                }}
                                className="hover:bg-white/20 p-0.5 rounded transition-colors"
                            >
                                <Check size={10} strokeWidth={4} />
                            </div>
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-text-muted/50 font-medium italic py-1">{placeholder}</span>
                )}
                
                <div className="ml-auto self-center">
                    {isLoading ? <Loader2 size={14} className="animate-spin opacity-40" /> : <ChevronDown size={14} className={cn("opacity-40 transition-transform", isOpen && "rotate-180")} />}
                </div>
            </div>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border-default rounded-2xl shadow-2xl z-50 overflow-hidden animation-slide-up origin-top">
                    <div className="p-3 border-b border-border-subtle">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            <input 
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search taxonomies..."
                                className="w-full h-10 pl-10 pr-4 bg-surface-sunken/40 border border-border-subtle rounded-xl text-xs focus:outline-none focus:border-accent-primary/40 transition-all font-medium"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto p-2 scrollbar-premium">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => {
                                const id = item.documentId || item.id;
                                const isSelected = selectedIds.includes(id);
                                return (
                                    <div 
                                        key={id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleItem(id);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl cursor-copy transition-all group",
                                            isSelected ? "bg-accent-primary/10 text-accent-primary" : "hover:bg-surface-sunken text-text-muted hover:text-text-primary"
                                        )}
                                    >
                                        <span className={cn("text-xs font-bold", isSelected ? "tracking-wide" : "font-medium")}>
                                            {item.title || item.type}
                                        </span>
                                        {isSelected && <Check size={14} strokeWidth={3} />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center opacity-40 italic text-[10px] font-bold uppercase tracking-widest">
                                {isLoading ? "Synching archives..." : "No matches found"}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-surface-sunken/40 border-t border-border-subtle flex justify-end">
                        <button 
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-1.5 rounded-lg bg-near-black text-ivory text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Finalize Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
