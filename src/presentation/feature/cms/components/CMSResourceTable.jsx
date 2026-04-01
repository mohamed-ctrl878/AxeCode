import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useDeleteEvent } from '@domain/useCase/useDeleteEvent';
import { useDeleteProblem } from '@domain/useCase/useDeleteProblem';
import { Activity, Calendar, ChevronRight, Database, Edit2, Layout, Plus, Settings, ShieldCheck, Trash2 } from 'lucide-react';

/**
 * CMSResourceTable: Reusable table for management resources.
 */
export const CMSResourceTable = ({ sectionName, items, isLoading, icon: Icon, onRefresh }) => {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const { deleteEvent, inProgress: isDeletingEvent } = useDeleteEvent();
    const { deleteProblem, inProgress: isDeletingProblem } = useDeleteProblem();
    const isDeleting = isDeletingEvent || isDeletingProblem;

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
        return '#/create';
    };

    const handleRemove = async (id, title) => {
        if (window.confirm(`Are you sure you want to permanently remove "${title}"? This action cannot be undone.`)) {
            try {
                if (sectionName === 'Events') {
                    await deleteEvent(id);
                } else if (sectionName === 'Problems') {
                    await deleteProblem(id);
                }
                // Notify parent to refresh
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error("Removal failed:", err);
            }
        }
    };

    return (
        <div className="space-y-6 animation-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{sectionName} Management</h2>
                    <p className="text-text-muted text-xs mt-1">Manage and orchestrate all your {sectionName.toLowerCase()} in one place.</p>
                </div>
                <Link 
                    to={getCreateRoute()}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-black rounded-xl text-xs font-bold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                >
                    <Plus size={16} />
                    CREATE NEW {sectionName.toUpperCase().slice(0, -1)}
                </Link>
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
                    {isLoading ? (
                        <div className="px-6 py-12 text-center text-sm font-bold text-text-muted animate-pulse">
                            Loading {sectionName}...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm font-bold text-text-muted">
                            No {sectionName.toLowerCase()} found. Get started by creating one!
                        </div>
                    ) : items.map((item, idx) => {
                        // Secure strict primitive ID for React keys to avoid DevTools "Cannot convert object to primitive" crashes
                        const rawId = item?.uid || item?.documentId || item?.id;
                        const id = typeof rawId === 'object' || !rawId ? `fallback-id-${idx}` : String(rawId);
                        
                        const title = item?.title || `Untitled ${sectionName.slice(0, -1)} (${id})`;
                        
                        // Infer status logic: if publishedAt exists -> Active, else Draft
                        const isActive = item?.publishedAt != null;
                        const statusLabel = isActive ? 'Active' : (item?.id ? 'Draft' : 'Active'); 
                        const statusColor = isActive || !item?.id ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20';

                        const dateStr = item?.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                            : 'feb 15, 2026';

                        return (
                            <div key={id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface-dark border border-white/5 flex items-center justify-center text-text-muted group-hover:text-accent-primary transition-colors">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">{title}</div>
                                        <div className="text-[10px] text-text-muted font-mono tracking-tighter mt-0.5 uppercase">created on {dateStr}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight border ${statusColor}`}>
                                        {statusLabel}
                                    </span>
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Activity size={12} />
                                        <span className="text-xs font-mono">{(Math.random() * 100).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative" ref={openDropdownId === id ? dropdownRef : null}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(openDropdownId === id ? null : id);
                                                }}
                                                className={`p-2 rounded-lg transition-all ${
                                                    openDropdownId === id 
                                                        ? 'bg-white/10 text-text-primary' 
                                                        : 'hover:bg-white/5 text-text-muted hover:text-text-primary'
                                                }`}
                                            >
                                                <Settings size={14} />
                                            </button>
                                            
                                            {/* Dropdown Menu - Courses */}
                                            {openDropdownId === id && sectionName === 'Courses' && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animation-fade-in origin-top-right">
                                                    <div className="p-2 space-y-1">
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/edit`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                            Update course metadata
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/weeks`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Calendar size={14} />
                                                            Manage weeks
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/courses/${id}/entitlement`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <ShieldCheck size={14} />
                                                            Manage entitlement
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}

                                             {/* Dropdown Menu - Events */}
                                             {openDropdownId === id && sectionName === 'Events' && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animation-fade-in origin-top-right">
                                                    <div className="p-2 space-y-1">
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/events/${id}/entitlement`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <ShieldCheck size={14} />
                                                            Manage entitlement
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/events/${id}/subscription-analysis`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Activity size={14} />
                                                            Subscription analysis
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/events/${id}/edit`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit
                                                        </Link>
                                                        <div className="h-[1px] bg-white/5 my-1" />
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemove(id, title);
                                                            }}
                                                            disabled={isDeleting}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 size={14} />
                                                            Remove Event
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                             {/* Dropdown Menu - Problems */}
                                            {openDropdownId === id && sectionName === 'Problems' && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animation-fade-in origin-top-right">
                                                    <div className="p-2 space-y-1">
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/edit`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                            Configure Signature
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/test-cases`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Database size={14} />
                                                            Manage Test Cases
                                                        </Link>
                                                        <Link 
                                                            to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/analysis`} 
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Activity size={14} />
                                                            Submission Analysis
                                                        </Link>
                                                        <div className="h-[1px] bg-white/5 my-1" />
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemove(id, title);
                                                            }}
                                                            disabled={isDeleting}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 size={14} />
                                                            Remove Problem
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                                <ChevronRight size={14} className="text-text-muted/30 group-hover:text-accent-primary transition-colors" />
                                            </div>
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
