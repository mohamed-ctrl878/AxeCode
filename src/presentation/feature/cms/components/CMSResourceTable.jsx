import React from 'react';
import { Plus, Activity, Settings, ChevronRight } from 'lucide-react';

/**
 * CMSResourceTable: Reusable table for management resources.
 */
export const CMSResourceTable = ({ sectionName, items, icon: Icon }) => {
    return (
        <div className="space-y-6 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{sectionName} Management</h2>
                    <p className="text-text-muted text-xs mt-1">Manage and orchestrate all your {sectionName.toLowerCase()} in one place.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-black rounded-xl text-xs font-bold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <Plus size={16} />
                    CREATE NEW {sectionName.toUpperCase().slice(0, -1)}
                </button>
            </div>

            <div className="bento-card overflow-hidden border border-white/5">
                <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Resource Name</span>
                    <div className="flex items-center gap-12 text-[10px] font-bold text-text-muted uppercase tracking-widest pr-12">
                        <span>Status</span>
                        <span>Engagement</span>
                        <span>Actions</span>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {items.map((item) => (
                        <div key={item} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-surface-dark border border-white/5 flex items-center justify-center text-text-muted group-hover:text-accent-primary transition-colors">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Demo {sectionName.slice(0, -1)} Project #{item}</div>
                                    <div className="text-[10px] text-text-muted font-mono tracking-tighter mt-0.5 uppercase">published on feb 15, 2026</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <span className="px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary text-[9px] font-bold uppercase tracking-tight border border-accent-primary/20">Active</span>
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Activity size={12} />
                                    <span className="text-xs font-mono">{(Math.random() * 100).toFixed(1)}k</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all">
                                        <Settings size={14} />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent-primary transition-all">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
