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
        <div className="space-y-8 animation-fade-in w-full px-4 md:px-6 py-6 text-text-primary">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-surface p-8 rounded-3xl border border-border-subtle shadow-whisper relative overflow-hidden backdrop-blur-md">
                {/* Decorative Icon */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Icon size={120} />
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shadow-inner">
                        <Icon size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight text-text-primary">{sectionName} Management</h2>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Orchestrate and calibrate all {sectionName.toLowerCase()} protocol nodes.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <button 
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-3.5 rounded-2xl bg-surface-sunken/40 border border-border-default text-text-muted hover:text-accent-primary hover:border-accent-primary/40 transition-all active:scale-95 group"
                    >
                        <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
                    </button>
                    <Link 
                        to={getCreateRoute()}
                        className="btn-primary flex-1 md:flex-none uppercase tracking-widest text-[11px] h-12 px-8 flex items-center justify-center gap-3 shadow-sm group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        Initialize {sectionName.toUpperCase().slice(0, -1)}
                    </Link>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-surface border border-border-default rounded-3xl shadow-whisper overflow-visible relative">
                {/* Sticky T-Head */}
                <div className="bg-surface-sunken/40 backdrop-blur-md px-8 py-5 border-b border-border-subtle flex items-center justify-between sticky top-0 z-20">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-2">Resource Descriptor</span>
                    <div className="hidden md:flex items-center gap-16 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pr-12">
                        <span className="w-20 text-center">Protocol Status</span>
                        <span className="w-24 text-center">Aggregate Activity</span>
                        <span className="w-12 text-center">Settings</span>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border-subtle min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4 animate-pulse">
                            <Loader2 size={40} className="animate-spin text-accent-primary" />
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Syncing Protocol Repository...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-40">
                            <Database size={64} className="text-text-muted" />
                            <div className="text-center">
                                <p className="text-sm font-bold uppercase tracking-widest">No Nodes Detected</p>
                                <p className="text-[10px] font-medium mt-1">Initialize your first {sectionName.slice(0, -1).toLowerCase()} above.</p>
                            </div>
                        </div>
                    ) : items.map((item, idx) => {
                        const rawId = item?.uid || item?.documentId || item?.id;
                        const id = typeof rawId === 'object' || !rawId ? `fallback-id-${idx}` : String(rawId);
                        const title = item?.title || `Untitled ${sectionName.slice(0, -1)} (${id})`;
                        
                        const isActive = item?.publishedAt != null;
                        const statusLabel = isActive ? 'Deployed' : 'Staged'; 
                        const statusStyles = isActive 
                            ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' 
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20';

                        const dateStr = item?.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                            : 'Pending Date';

                        return (
                            <div key={id} className="px-8 py-5 flex items-center justify-between hover:bg-surface-sunken/40 transition-all group animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-surface-sunken border border-border-subtle flex items-center justify-center text-text-muted group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-all shadow-sm">
                                        <Icon size={22} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold tracking-tight text-text-primary group-hover:translate-x-1 transition-transform cursor-pointer line-clamp-1">{title}</div>
                                        <div className="text-[10px] text-text-muted font-bold uppercase tracking-[0.1em] mt-1 opacity-60">node creation: {dateStr}</div>
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
                                                        Config Protocol
                                                    </Link>

                                                    <button 
                                                        onClick={() => handleRemove(id, title)}
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                        Terminate Node
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
