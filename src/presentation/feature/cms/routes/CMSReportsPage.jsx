import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Clock, Eye, Trash2, RefreshCw, AlertTriangle, MessageSquare, Database } from 'lucide-react';
import { useFetchAdminReports } from '@domain/useCase/useFetchAdminReports';
import { useConfirm } from '@presentation/shared/provider/ConfirmationProvider';
import { cn } from '@core/utils/cn';

/**
 * CMSReportsPage - Admin dashboard for reviewing user reports.
 * Provides status filtering and moderation actions.
 */
const CMSReportsPage = () => {
    const { reports, isLoading, fetch, updateStatus, deleteReport, statusFilter, setStatusFilter } = useFetchAdminReports();
    const { confirm } = useConfirm();

    const statusTabs = [
        { id: null, label: 'All', icon: Eye },
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
        { id: 'dismissed', label: 'Dismissed', icon: XCircle }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'resolved': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
            case 'dismissed': return 'bg-rose-900/30 text-rose-400 border-rose-500/30';
            default: return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
        }
    };

    return (
        <div className="space-y-8 animation-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-ivory p-8 rounded-[32px] border border-border-default shadow-whisper">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-accent-rose/10 flex items-center justify-center text-accent-rose border border-accent-rose/20">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-near-black">Reports Review</h2>
                        <p className="text-[11px] text-text-muted font-serif italic mt-1">Review and moderate content reports from users.</p>
                    </div>
                </div>
                <button onClick={fetch} disabled={isLoading} className="p-3 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black transition-all">
                    <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 bg-ivory p-2 rounded-2xl border border-border-default w-fit">
                {statusTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = statusFilter === tab.id;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => setStatusFilter(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                isActive
                                    ? "bg-near-black text-ivory shadow-lg"
                                    : "text-text-muted hover:bg-surface-sunken hover:text-near-black"
                            )}
                        >
                            <TabIcon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Reports List */}
            <div className="bg-ivory border border-border-default rounded-[32px] shadow-whisper overflow-hidden">
                <div className="bg-parchment/80 px-8 py-4 border-b border-border-default flex items-center justify-between sticky top-0 z-10">
                    <span className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Content Report</span>
                    <div className="hidden md:flex items-center gap-16 text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">
                        <span className="w-24 text-center">Status</span>
                        <span className="w-24 text-center">Type</span>
                        <span className="w-20 text-center">Actions</span>
                    </div>
                </div>

                <div className="divide-y divide-border-subtle/50 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-pulse">
                            <RefreshCw size={40} className="animate-spin text-near-black/20" />
                            <p className="text-[11px] font-bold text-near-black/40 font-serif uppercase tracking-[0.3em]">Loading reports...</p>
                        </div>
                    ) : (!Array.isArray(reports) || reports.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
                            <Database size={60} className="text-text-muted" />
                            <p className="text-lg font-serif font-bold text-near-black">No Reports Found</p>
                        </div>
                    ) : reports.map((report, idx) => {
                        const id = report?.documentId || report?.id || `report-${idx}`;
                        const contentType = report?.content_type || 'unknown';
                        const status = report?.review_status || 'pending';
                        const reporter = report?.reporter_user?.username || 'Anonymous';
                        const reported = report?.reported_user?.username || 'Unknown';
                        const dateStr = report?.createdAt
                            ? new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'Unknown';

                        return (
                            <div key={id} className="px-8 py-5 flex items-center justify-between hover:bg-parchment/40 transition-all group">
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-accent-rose/10 flex items-center justify-center text-accent-rose shrink-0">
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-serif font-bold text-near-black truncate">
                                            {reporter} → {reported}
                                        </div>
                                        <div className="text-[10px] text-text-muted font-serif italic mt-0.5">
                                            {dateStr} · Content: {contentType}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border hidden md:inline-block", getStatusStyles(status))}>
                                        {status}
                                    </span>
                                    <span className="hidden md:inline-block px-2 py-1 rounded bg-surface-sunken border border-border-subtle text-[9px] font-mono text-text-muted uppercase w-24 text-center">
                                        {contentType}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(id, 'resolved')}
                                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-200"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(id, 'dismissed')}
                                                    className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all border border-amber-200"
                                                    title="Dismiss"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={async () => {
                                                const ok = await confirm({
                                                    title: 'Archive Record',
                                                    message: 'Permanently expunge this internal moderation report? This data will be erased from scholarly history.',
                                                    confirmLabel: 'Confirm Purge',
                                                    type: 'danger'
                                                });
                                                if (ok) deleteReport(id);
                                            }}
                                            className="p-2 rounded-lg text-accent-rose/60 hover:bg-accent-rose/10 hover:text-accent-rose transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
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

export default CMSReportsPage;
