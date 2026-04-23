import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useDeleteEvent } from '@domain/useCase/useDeleteEvent';
import { useDeleteProblem } from '@domain/useCase/useDeleteProblem';
import { useDeleteRoadmap } from '@domain/useCase/useDeleteRoadmap';
import { useDeleteReportType } from '@domain/useCase/useDeleteReportType';
import { 
    Activity, Calendar, ChevronRight, Database, Edit2, Layout, Plus, 
    Settings, ShieldCheck, Trash2, RefreshCw, Loader2, Search, 
    CheckSquare, Square, MoreHorizontal, Filter, ArrowUpDown
} from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CMSResourceTable: Advanced Premium Archive Table.
 * Features: Search, Bulk Actions, Server-Side Pagination support, and isDraft status logic.
 */
export const CMSResourceTable = ({ 
    sectionName, 
    items = [], 
    isLoading, 
    icon: Icon, 
    onRefresh,
    pagination, // { page, pageSize, pageCount, total }
    onPageChange,
    onSearchChange
}) => {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const dropdownRef = useRef(null);

    const { deleteEvent } = useDeleteEvent();
    const { deleteProblem } = useDeleteProblem();
    const { deleteRoadmap } = useDeleteRoadmap();
    const { deleteReportType } = useDeleteReportType();

    // Reset selection when items change
    useEffect(() => {
        setSelectedIds([]);
    }, [items]);

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
        if (sectionName === 'Report-Reasons') return PATHS.REPORT_TYPE_CREATE;
        return '#/create';
    };

    const handleRemove = async (id, title) => {
        if (window.confirm(`Are you sure you want to permanently remove "${title}"? This action cannot be undone.`)) {
            try {
                if (sectionName === 'Events') await deleteEvent(id);
                else if (sectionName === 'Problems') await deleteProblem(id);
                else if (sectionName === 'Roadmaps') await deleteRoadmap(id);
                else if (sectionName === 'Report-Reasons') await deleteReportType(id);
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error("Removal failed:", err);
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item.uid || item.documentId || item.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-8 animation-fade-in w-full pb-20">
            {/* 1. SCHOLARLY HEADER */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-ivory p-10 rounded-[40px] border border-border-default shadow-whisper relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none transform rotate-12">
                    <Icon size={280} />
                </div>

                <div className="flex items-center gap-7 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-near-black flex items-center justify-center text-ivory shadow-lg">
                        <Icon size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-bold tracking-tight text-near-black">{sectionName} Archive</h2>
                        <div className="flex items-center gap-3 mt-2">
                             <span className="text-[10px] bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded font-bold uppercase tracking-widest border border-accent-primary/20">Master Ledger</span>
                             <p className="text-[11px] text-text-muted font-serif italic opacity-60">Total volume: {pagination?.total || items.length} entries</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <button 
                        onClick={onRefresh}
                        className="p-4 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
                    </button>
                    <Link 
                        to={getCreateRoute()}
                        className="btn-dark flex-1 md:flex-none font-serif text-[14px] h-14 px-10 flex items-center justify-center gap-4 shadow-xl active:scale-[0.97]"
                    >
                        <Plus size={20} />
                        Append Entry
                    </Link>
                </div>
            </div>

            {/* 2. REPOSITORY CONTROLS (Search & Bulk) */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted opacity-40" size={18} />
                    <input 
                        type="text"
                        placeholder={`Query archive for ${sectionName.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (onSearchChange) onSearchChange(e.target.value);
                        }}
                        className="w-full h-16 pl-16 pr-6 bg-ivory border border-border-default rounded-[24px] font-serif italic text-sm focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all shadow-whisper"
                    />
                </div>
                
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 bg-near-black text-ivory px-6 h-16 rounded-[24px] shadow-lg animation-slide-up">
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{selectedIds.length} Selections</span>
                        <div className="w-px h-6 bg-ivory/20 mx-2" />
                        <button className="text-[10px] font-bold uppercase hover:text-accent-rose transition-colors">Retract All</button>
                    </div>
                )}
            </div>

            {/* 3. REPOSITORY LEDGER */}
            <div className="bg-ivory border border-border-default rounded-[40px] shadow-whisper overflow-hidden relative">
                {/* Ledger Header */}
                <div className="bg-parchment/80 backdrop-blur-sm px-10 py-6 border-b border-border-default flex items-center sticky top-0 z-20">
                    <div className="flex items-center gap-6 flex-1">
                        <button onClick={toggleSelectAll} className="text-text-muted hover:text-near-black transition-colors">
                            {selectedIds.length === items.length && items.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                        <span className="text-[10px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Manuscript Identity</span>
                    </div>
                    <div className="hidden md:flex items-center gap-16 lg:gap-24 text-[10px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em] pr-8">
                        <span className="w-24 text-center">Status</span>
                        <span className="w-24 text-center">Inquiry Rate</span>
                        <span className="w-8 text-center"><MoreHorizontal size={16} /></span>
                    </div>
                </div>

                {/* Ledger Rows */}
                <div className="divide-y divide-border-subtle/40 min-h-[500px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6">
                            <Loader2 size={40} className="animate-spin text-accent-primary/40" />
                            <p className="text-[11px] font-bold text-near-black/30 font-serif uppercase tracking-[0.2em]">Consulting Archives...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-48 opacity-30 gap-6">
                            <Database size={60} />
                            <p className="font-serif italic text-sm">No scripts found matching your criteria.</p>
                        </div>
                    ) : items.map((item, idx) => {
                        const id = item?.uid || item?.documentId || item?.id || `idx-${idx}`;
                        const isSelected = selectedIds.includes(id);
                        const title = item?.title || item?.type || `Codex #${id.toString().slice(-4)}`;
                        
                        // IS DRAFT LOGIC - THE CORE CHANGE
                        const isDraft = item?.isDraft === true; 
                        
                        const dateStr = item?.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : 'Unknown';

                        return (
                            <div 
                                key={id} 
                                className={cn(
                                    "px-10 py-7 flex items-center transition-all duration-500 group relative",
                                    isSelected ? "bg-parchment/60" : "hover:bg-parchment/30"
                                )}
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <button 
                                        onClick={() => toggleSelect(id)}
                                        className={cn("transition-colors", isSelected ? "text-near-black" : "text-text-muted/40 group-hover:text-near-black/40")}
                                    >
                                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </button>
                                    
                                    <div className="flex items-center gap-7">
                                        <div className="w-14 h-14 rounded-2xl bg-surface-sunken border border-border-default flex items-center justify-center text-text-muted group-hover:bg-near-black group-hover:text-ivory transition-all shadow-sm">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-serif font-bold text-near-black group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
                                            <p className="text-[10px] text-text-muted font-serif italic mt-1 opacity-50">Catalogued on {dateStr} • Ref: {id.toString().slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16 lg:gap-24">
                                    {/* STATUS BADGE - isDraft based */}
                                    <div className="hidden md:flex w-24 justify-center">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border shadow-sm",
                                            isDraft 
                                                ? "bg-surface-sunken text-text-muted border-border-default" 
                                                : "bg-accent-primary text-on-accent border-accent-primary shadow-accent-primary/20"
                                        )}>
                                            {isDraft ? 'In Review' : 'Published'}
                                        </span>
                                    </div>

                                    {/* MOCK STATS */}
                                    <div className="hidden lg:flex items-center gap-3 text-text-muted w-24 justify-center bg-near-black/[0.03] py-2 rounded-xl border border-border-subtle shadow-inner">
                                        <Activity size={12} className="text-accent-primary" />
                                        <span className="text-[10px] font-bold font-mono">{(Math.random() * 20).toFixed(1)}k+</span>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="relative w-8 flex justify-center" ref={openDropdownId === id ? dropdownRef : null}>
                                        <button 
                                            onClick={() => setOpenDropdownId(openDropdownId === id ? null : id)}
                                            className={cn(
                                                "p-3 rounded-xl border transition-all",
                                                openDropdownId === id ? "bg-near-black text-ivory border-near-black" : "bg-white border-border-subtle hover:border-near-black"
                                            )}
                                        >
                                            <Settings size={16} className={cn(openDropdownId === id && "rotate-90 transition-transform")} />
                                        </button>

                                        {openDropdownId === id && (
                                            <div className="absolute right-0 top-full mt-4 w-60 bg-surface-elevated border border-border-default rounded-3xl shadow-whisper z-50 overflow-hidden animation-slide-up origin-top-right">
                                                <div className="p-3 space-y-1">
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
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-2xl transition-all"
                                                    >
                                                        <Edit2 size={16} /> Edit Manuscript
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleRemove(id, title)}
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-[10px] font-bold uppercase tracking-widest text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={16} /> Retract Entry
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

                {/* PAGINATION FOOTER */}
                {pagination && pagination.pageCount > 1 && (
                    <div className="px-10 py-8 border-t border-border-default bg-parchment/20 flex items-center justify-between">
                        <p className="text-[10px] font-serif italic text-text-muted opacity-60">Showing {items.length} of {pagination.total} records</p>
                        <div className="flex items-center gap-2">
                             {[...Array(pagination.pageCount)].map((_, i) => (
                                 <button
                                    key={i}
                                    onClick={() => onPageChange && onPageChange(i + 1)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-[10px] font-bold transition-all border",
                                        pagination.page === i+1 
                                            ? "bg-near-black text-ivory border-near-black" 
                                            : "bg-white text-text-muted border-border-subtle hover:border-near-black"
                                    )}
                                 >
                                    {i + 1}
                                 </button>
                             ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
