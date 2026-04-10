import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useDeleteEvent } from '@domain/useCase/useDeleteEvent';
import { useDeleteProblem } from '@domain/useCase/useDeleteProblem';
import { useDeleteRoadmap } from '@domain/useCase/useDeleteRoadmap';
import { Activity, Calendar, ChevronRight, Database, Edit2, Layout, Plus, Settings, ShieldCheck, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CMSResourceTable: Reusable premium table for management resources.
 * Supports Light/Dark modes with semantic tokens.
 */
export const CMSResourceTable = ({ sectionName, items, isLoading, icon: Icon, onRefresh }) => {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const { deleteEvent, inProgress: isDeletingEvent } = useDeleteEvent();
    const { deleteProblem, inProgress: isDeletingProblem } = useDeleteProblem();
    const { deleteRoadmap, inProgress: isDeletingRoadmap } = useDeleteRoadmap();
    const isDeleting = isDeletingEvent || isDeletingProblem || isDeletingRoadmap;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getCreateRoute = () => {
        if (sectionName === 'Courses') return PATHS.COURSE_CREATE;
        if (sectionName === 'Articles') return `${PATHS.ARTICLES}/write`;
        if (sectionName === 'Events') return PATHS.EVENT_CREATE;
        if (sectionName === 'Problems') return PATHS.PROBLEM_CREATE;
        if (sectionName === 'Roadmaps') return `${PATHS.CONTENT_MANAGEMENT}/roadmaps/create`;
        return '#/create';
    };

    const handleRemove = async (id, title) => {
        if (window.confirm(`Are you sure you want to permanently remove "${title}"? This action cannot be undone.`)) {
            try {
                if (sectionName === 'Events') {
                    await deleteEvent(id);
                } else if (sectionName === 'Problems') {
                    await deleteProblem(id);
                } else if (sectionName === 'Roadmaps') {
                    await deleteRoadmap(id);
                }
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error("Removal failed:", err);
            }
        }
    };

    return (
        <div className="space-y-10 animation-fade-in w-full px-4 md:px-0 py-4 text-text-primary mb-12">
            {/* Scholarly Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-ivory p-10 rounded-[40px] border border-border-default shadow-whisper relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none transform rotate-12">
                    <Icon size={280} />
                </div>

                <div className="flex items-center gap-7 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-near-black flex items-center justify-center text-ivory shadow-lg">
                        <Icon size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-bold tracking-tight text-near-black">{sectionName} Archive</h2>
                        <p className="text-[11px] text-text-muted font-serif italic tracking-wide mt-2">Curating and maintaining the higher fidelity knowledge base for {sectionName.toLowerCase()}.</p>
                    </div>
                </div>

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                    <button 
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-4 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black hover:border-near-black transition-all active:scale-95"
                    >
                        <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
                    </button>
                    <Link 
                        to={getCreateRoute()}
                        className="btn-dark flex-1 md:flex-none font-serif tracking-normal text-[14px] h-14 px-10 flex items-center justify-center gap-4 shadow-xl active:scale-[0.97]"
                    >
                        <Plus size={20} />
                        New {sectionName.slice(0, -1)} Entry
                    </Link>
                </div>
            </div>

            {/* Repository Table Area */}
            <div className="bg-ivory border border-border-default rounded-[40px] shadow-whisper overflow-hidden relative">
                {/* Sticky Ledger Head */}
                <div className="bg-parchment/80 backdrop-blur-sm px-10 py-6 border-b border-border-default flex items-center justify-between sticky top-0 z-20">
                    <span className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Manuscript Descriptor</span>
                    <div className="hidden md:flex items-center gap-20 text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em] pr-12">
                        <span className="w-24 text-center">Shelf Status</span>
                        <span className="w-24 text-center">Reader Engagement</span>
                        <span className="w-12 text-center">Edit</span>
                    </div>
                </div>

                {/* Ledger Body */}
                <div className="divide-y divide-border-subtle/50 min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
                            <RefreshCw size={48} className="animate-spin text-near-black/20" />
                            <p className="text-[11px] font-bold text-near-black/40 font-serif uppercase tracking-[0.3em]">Restoring Library Indices...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-48 gap-8 opacity-40">
                            <Database size={80} className="text-text-muted" />
                            <div className="text-center">
                                <p className="text-lg font-serif font-bold tracking-widest text-near-black">Archive Empty</p>
                                <p className="text-[11px] font-serif italic mt-2">Initialize your first {sectionName.slice(0, -1).toLowerCase()} entry above.</p>
                            </div>
                        </div>
                    ) : items.map((item, idx) => {
                        const rawId = item?.uid || item?.documentId || item?.id;
                        const id = typeof rawId === 'object' || !rawId ? `fallback-id-${idx}` : String(rawId);
                        const title = item?.title || `Untitled ${sectionName.slice(0, -1)} (${id})`;
                        
                        const isActive = item?.publishedAt != null;
                        const statusLabel = isActive ? 'Archived' : 'Drafted'; 
                        const statusStyles = isActive 
                            ? 'bg-near-black text-ivory border-near-black' 
                            : 'bg-surface-sunken text-text-muted border-border-default';

                        const dateStr = item?.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                            : 'Date Unknown';

                        return (
                            <div key={id} className="px-10 py-6 flex items-center justify-between hover:bg-parchment/40 transition-all group duration-500">
                                <div className="flex items-center gap-7">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-sunken border border-border-default flex items-center justify-center text-text-muted group-hover:bg-near-black group-hover:text-ivory transition-all shadow-sm">
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-serif font-bold tracking-tight text-near-black transition-transform cursor-pointer line-clamp-1 group-hover:translate-x-1 duration-300">{title}</div>
                                        <div className="text-[11px] text-text-muted font-serif italic mt-1.5 opacity-60">Entry recorded on {dateStr}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 md:gap-16">
                                    <div className="hidden md:flex w-20 justify-center">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm transition-all animate-pulse-subtle",
                                            statusStyles
                                        )}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <div className="hidden md:flex items-center gap-3 text-text-muted w-24 justify-center bg-surface-sunken/40 py-2 rounded-xl border border-border-subtle shadow-inner">
                                        <Activity size={14} className="text-accent-primary" />
                                        <span className="text-[10px] font-bold font-mono">{(Math.random() * 50).toFixed(1)}k+</span>
                                    </div>

                                    <div className="relative w-12 flex justify-center" ref={openDropdownId === id ? dropdownRef : null}>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdownId(openDropdownId === id ? null : id);
                                            }}
                                            className={cn(
                                                "p-3 rounded-xl transition-all shadow-sm border",
                                                openDropdownId === id 
                                                    ? 'bg-accent-primary text-on-accent border-accent-primary' 
                                                    : 'bg-surface border-border-subtle hover:border-accent-primary/40 text-text-muted hover:text-text-primary'
                                            )}
                                        >
                                            <Settings size={16} className={cn(openDropdownId === id && "rotate-90 transition-transform")} />
                                        </button>
                                        
                                        {/* Dropdown Menu - Unified & Premium */}
                                        {openDropdownId === id && (
                                            <div className="absolute right-0 top-full mt-3 w-64 bg-surface-elevated border border-border-default rounded-2xl shadow-whisper z-50 overflow-hidden animation-slide-up origin-top-right">
                                                <div className="p-3 space-y-1.5">
                                                    {/* Dynamic Edit Route */}
                                                    <Link 
                                                        to={
                                                            sectionName === 'Roadmaps' 
                                                                ? `${PATHS.CONTENT_MANAGEMENT}/roadmaps/${id}`
                                                                : sectionName === 'Problems'
                                                                    ? `${PATHS.CONTENT_MANAGEMENT}/problems/${id}/edit`
                                                                    : sectionName === 'Courses'
                                                                        ? `${PATHS.CONTENT_MANAGEMENT}/courses/${id}/edit`
                                                                        : `${PATHS.CONTENT_MANAGEMENT}/${sectionName.toLowerCase()}/${id}/edit`
                                                        } 
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-2xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                        Examine Manuscript
                                                    </Link>

                                                    <button 
                                                        onClick={() => handleRemove(id, title)}
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                        Retract Entry
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
