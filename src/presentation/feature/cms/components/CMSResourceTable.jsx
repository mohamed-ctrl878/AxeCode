import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';
import { useDeleteEvent } from '@domain/useCase/useDeleteEvent';
import { useDeleteProblem } from '@domain/useCase/useDeleteProblem';
import { useDeleteRoadmap } from '@domain/useCase/useDeleteRoadmap';
import { useDeleteReportType } from '@domain/useCase/useDeleteReportType';
import { useDeleteCourse } from '@domain/useCase/useDeleteCourse';
import { Activity, Calendar, ChevronRight, ChevronLeft, Database, Edit2, Layout, Plus, Settings, ShieldCheck, Trash2, RefreshCw, Loader2, Eye, EyeOff, Search, CheckSquare, Square } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CMSResourceTable: Reusable premium table for management resources.
 * Supports delete for all content types + publish/unpublish toggle.
 */
export const CMSResourceTable = ({ 
    sectionName, 
    items, 
    isLoading, 
    icon: Icon, 
    onRefresh, 
    onDelete, 
    columns,
    // Server-Side support
    serverPagination = false,
    serverPage = 1,
    serverTotalPages = 1,
    serverTotalItems = 0,
    onPageChange = null,
    onSearchChange = null
}) => {
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    const { deleteEvent, inProgress: isDeletingEvent } = useDeleteEvent();
    const { deleteProblem, inProgress: isDeletingProblem } = useDeleteProblem();
    const { deleteRoadmap, inProgress: isDeletingRoadmap } = useDeleteRoadmap();
    const { deleteReportType, inProgress: isDeletingReportType } = useDeleteReportType();
    const { deleteCourse, inProgress: isDeletingCourse } = useDeleteCourse();
    const isDeleting = isDeletingEvent || isDeletingProblem || isDeletingRoadmap || isDeletingReportType || isDeletingCourse;

    // Search, Pagination, and Selection state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const itemsPerPage = 10;

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
                else if (sectionName === 'Courses') await deleteCourse(id);
                else if (onDelete) await onDelete(id); // Generic delete handler for Global-Tags, FAQs, etc.
                
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error("Removal failed:", err);
            }
        }
    };

    const handleBulkRemove = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to permanently remove ${selectedIds.length} select entries?`)) {
            try {
                for (const id of selectedIds) {
                    if (sectionName === 'Events') await deleteEvent(id);
                    else if (sectionName === 'Problems') await deleteProblem(id);
                    else if (sectionName === 'Roadmaps') await deleteRoadmap(id);
                    else if (sectionName === 'Report-Reasons') await deleteReportType(id);
                    else if (sectionName === 'Courses') await deleteCourse(id);
                    else if (onDelete) await onDelete(id);
                }
                if (onRefresh) onRefresh();
                setSelectedIds([]);
            } catch (err) {
                console.error("Bulk removal failed:", err);
            }
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = (visibleItems) => {
        if (selectedIds.length === visibleItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(visibleItems.map(item => String(item?.uid || item?.documentId || item?.id)));
        }
    };

    // Client/Server-side transformations
    const safeItems = Array.isArray(items) ? items : [];
    
    let filteredItems, paginatedItems, totalPages;

    if (serverPagination) {
        filteredItems = safeItems;
        paginatedItems = safeItems;
        totalPages = serverTotalPages;
    } else {
        filteredItems = safeItems.filter(item => {
            if (!searchQuery) return true;
            const title = item?.title || item?.name || item?.username || item?.type || '';
            return title.toLowerCase().includes(searchQuery.toLowerCase());
        });
        totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
        paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }

    const activePage = serverPagination ? serverPage : currentPage;

    // Reset page if out of bounds due to search
    useEffect(() => {
        if (!serverPagination && currentPage > totalPages) setCurrentPage(1);
    }, [totalPages, currentPage, serverPagination]);

    // Clear selection on page change or data change
    useEffect(() => {
        setSelectedIds([]);
    }, [activePage, items]);

    // Debounced search trigger for server-side
    useEffect(() => {
        if (serverPagination && onSearchChange) {
            const timeoutId = setTimeout(() => {
                onSearchChange(searchQuery);
            }, 500); // 500ms debounce
            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery, serverPagination, onSearchChange]);

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

                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto flex-wrap">
                    <div className="flex items-center gap-3 relative mr-4 w-full md:w-64">
                        <div className="absolute left-4 text-text-muted">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search archive..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 bg-surface-sunken border border-border-default rounded-2xl text-[13px] font-medium font-serif tracking-wide placeholder:text-text-muted focus:outline-none focus:border-near-black transition-colors"
                        />
                    </div>
                    <button 
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-4 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black hover:border-near-black transition-all active:scale-95 shrink-0"
                    >
                        <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
                    </button>
                    <Link 
                        to={getCreateRoute()}
                        className="btn-dark flex-1 md:flex-none font-serif tracking-normal text-[14px] h-14 px-10 flex items-center justify-center gap-4 shadow-xl active:scale-[0.97] shrink-0"
                    >
                        <Plus size={20} />
                        New {sectionName.slice(0, -1)} Entry
                    </Link>
                </div>
            </div>

            {/* Repository Table Area */}
            <div className="bg-ivory border border-border-default rounded-[40px] shadow-whisper overflow-hidden relative">
                {/* Sticky Ledger Head */}
                <div className="bg-parchment/80 backdrop-blur-sm px-6 py-6 border-b border-border-default flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            className="text-text-muted hover:text-near-black transition-colors p-2"
                            onClick={() => toggleAll(paginatedItems)}
                        >
                            {paginatedItems.length > 0 && selectedIds.length === paginatedItems.length ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                        <span className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Manuscript Descriptor</span>
                    </div>
                    <div className="hidden md:flex items-center gap-20 text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em] pr-12">
                        <span className="w-24 text-center">{columns?.status || 'Shelf Status'}</span>
                        <span className="w-24 text-center">{columns?.metric || 'Engagement'}</span>
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
                    ) : paginatedItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-48 gap-8 opacity-40">
                            <Database size={80} className="text-text-muted" />
                            <div className="text-center">
                                <p className="text-lg font-serif font-bold tracking-widest text-near-black">Archive Empty</p>
                                <p className="text-[11px] font-serif italic mt-2">Initialize your first {sectionName.slice(0, -1).toLowerCase()} entry or modify search.</p>
                            </div>
                        </div>
                    ) : paginatedItems.map((item, idx) => {
                        const rawId = item?.uid || item?.documentId || item?.id;
                        const id = typeof rawId === 'object' || !rawId ? `fallback-id-${idx}` : String(rawId);
                        const title = item?.title || item?.name || item?.username || item?.type || `Untitled ${sectionName.slice(0, -1)} (${id})`;
                        
                        const isActive = item?.isActive !== undefined ? item.isActive : (item?.publishedAt != null);
                        const statusLabel = item?.statusLabel ?? (isActive ? 'Published' : 'Draft'); 
                        const statusStyles = item?.statusStyles ?? (isActive 
                            ? 'bg-near-black text-ivory border-near-black' 
                            : 'bg-surface-sunken text-text-muted border-border-default');

                        // Use real engagement_score from backend if available
                        const engagementScore = item?.metricValue ?? item?.engagement_score ?? item?.engagementScore ?? null;

                        const dateStr = item?.createdAt 
                            ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                            : 'Date Unknown';

                        return (
                            <div key={id} className={cn("px-6 py-6 flex items-center justify-between hover:bg-parchment/40 transition-all group duration-500", selectedIds.includes(id) && "bg-parchment/60")}>
                                <div className="flex items-center gap-4">
                                    <button 
                                        className={cn("p-2 transition-colors", selectedIds.includes(id) ? "text-near-black" : "text-border-default hover:text-text-muted")}
                                        onClick={() => toggleSelection(id)}
                                    >
                                        {selectedIds.includes(id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </button>
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
                                            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm transition-all",
                                            statusStyles
                                        )}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <div className="hidden md:flex items-center gap-3 text-text-muted w-24 justify-center bg-surface-sunken/40 py-2 rounded-xl border border-border-subtle shadow-inner">
                                        <Activity size={14} className="text-accent-primary" />
                                        <span className="text-[10px] font-bold font-mono">
                                            {engagementScore !== null ? `${engagementScore}` : '—'}
                                        </span>
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
                                        
                                        {/* Dropdown Menu */}
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
                                                                        : sectionName === 'Report-Reasons'
                                                                            ? PATHS.REPORT_TYPE_EDIT.replace(':id', id)
                                                                            : `${PATHS.CONTENT_MANAGEMENT}/${sectionName.toLowerCase()}/${id}/edit`
                                                        } 
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-surface-sunken rounded-2xl transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                        Examine Manuscript
                                                    </Link>

                                                    {/* Publish/Unpublish Status Indicator */}
                                                    <div className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest rounded-2xl text-text-muted">
                                                        {isActive ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-amber-500" />}
                                                        {statusLabel}
                                                    </div>

                                                    <div className="border-t border-border-subtle my-1" />

                                                    <button 
                                                        onClick={() => handleRemove(id, title)}
                                                        disabled={isDeleting}
                                                        className="w-full h-12 flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-widest text-accent-rose/70 hover:text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all disabled:opacity-40"
                                                    >
                                                        <Trash2 size={16} />
                                                        {isDeleting ? 'Removing...' : 'Retract Entry'}
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

            {/* Pagination & Bulk Operations Bar */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm font-serif text-text-muted">
                    {serverPagination ? (
                        <span>Showing {paginatedItems.length} items (Total: {serverTotalItems} entries)</span>
                    ) : (
                        <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries</span>
                    )}
                </div>

                {selectedIds.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-elevated border border-border-default shadow-2xl px-6 py-4 rounded-full flex items-center gap-6 z-50 animation-slide-up">
                        <span className="font-serif font-bold text-near-black text-sm">{selectedIds.length} selected</span>
                        <div className="w-px h-6 bg-border-subtle" />
                        <button 
                            disabled={isDeleting}
                            onClick={handleBulkRemove}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-rose hover:bg-accent-rose/10 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {isDeleting ? "Removing..." : "Remove Selected"}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => serverPagination ? onPageChange(Math.max(1, activePage - 1)) : setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={activePage === 1}
                        className="p-3 rounded-xl border border-border-default bg-ivory text-near-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-sunken transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="px-4 py-2 font-serif font-bold text-sm text-near-black">
                        {activePage} / {totalPages}
                    </div>
                    <button 
                        onClick={() => serverPagination ? onPageChange(Math.min(totalPages, activePage + 1)) : setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={activePage === totalPages}
                        className="p-3 rounded-xl border border-border-default bg-ivory text-near-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-sunken transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
