import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, Eye, RefreshCw, AlertTriangle, Database } from 'lucide-react';
import { useFetchAdminPayouts } from '@domain/useCase/useFetchAdminPayouts';
import { useConfirm } from '@presentation/shared/provider/ConfirmationProvider';
import { cn } from '@core/utils/cn';

/**
 * CMSPayoutsPage - Admin dashboard for reviewing publisher payout requests.
 */
const CMSPayoutsPage = () => {
    const { payouts, isLoading, fetch, updateStatus, statusFilter, setStatusFilter } = useFetchAdminPayouts();
    const { confirm } = useConfirm();

    const statusTabs = [
        { id: null, label: 'All', icon: Eye },
        { id: 'PENDING', label: 'Pending', icon: Clock },
        { id: 'PAID', label: 'Paid', icon: CheckCircle2 },
        { id: 'REJECTED', label: 'Rejected', icon: XCircle }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'PAID': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
            case 'REJECTED': return 'bg-rose-900/30 text-rose-400 border-rose-500/30';
            default: return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
        }
    };

    return (
        <div className="space-y-8 animation-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-ivory p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-border-default shadow-whisper">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-near-black">Payout Requests</h2>
                        <p className="text-[11px] text-text-muted font-serif italic mt-1">Review and manage publisher withdrawal requests.</p>
                    </div>
                </div>
                <button onClick={fetch} disabled={isLoading} className="p-3 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black transition-all">
                    <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 bg-ivory p-2 rounded-2xl border border-border-default w-full md:w-fit overflow-x-auto scrollbar-hide">
                {statusTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = statusFilter === tab.id;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => setStatusFilter(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
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

            {/* Payouts List */}
            <div className="bg-ivory border border-border-default rounded-[32px] shadow-whisper overflow-hidden">
                <div className="bg-parchment/80 px-4 md:px-8 py-3 md:py-4 border-b border-border-default flex items-center justify-between sticky top-0 z-10">
                    <span className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Payout Request</span>
                    <div className="hidden md:flex items-center gap-16 text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">
                        <span className="w-24 text-center">Status</span>
                        <span className="w-24 text-center">Amount</span>
                        <span className="w-20 text-center">Actions</span>
                    </div>
                </div>

                <div className="divide-y divide-border-subtle/50 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-pulse">
                            <RefreshCw size={40} className="animate-spin text-near-black/20" />
                            <p className="text-[11px] font-bold text-near-black/40 font-serif uppercase tracking-[0.3em]">Loading requests...</p>
                        </div>
                    ) : (!Array.isArray(payouts) || payouts.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
                            <Database size={60} className="text-text-muted" />
                            <p className="text-lg font-serif font-bold text-near-black">No Payout Requests</p>
                        </div>
                    ) : payouts.map((payout, idx) => {
                        const id = payout?.documentId || payout?.id || `payout-${idx}`;
                        const status = payout?.status || 'PENDING';
                        const owner = payout?.wallet?.owner?.username || 'Unknown User';
                        const amount = payout?.amount?.toLocaleString() || 0;
                        const method = payout?.method || 'N/A';
                        const details = payout?.details?.details || payout?.details || 'No details provided';
                        const dateStr = payout?.createdAt
                            ? new Date(payout.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : 'Unknown';

                        return (
                            <div key={id} className="px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-parchment/40 transition-all group">
                                <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <CreditCard size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-serif font-bold text-near-black truncate">
                                            {owner} - {method}
                                        </div>
                                        <div className="text-[10px] text-text-muted font-serif italic mt-0.5 truncate">
                                            {dateStr} · {details}
                                        </div>
                                        {payout.admin_notes && (
                                            <div className="text-[10px] text-rose-500 font-bold mt-1">
                                                Note: {payout.admin_notes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Actions / Statuses */}
                                    <div className="flex md:hidden flex-col items-end gap-2">
                                        <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border", getStatusStyles(status))}>
                                            {status}
                                        </span>
                                        <span className="font-bold text-lg text-near-black">{amount} EGP</span>
                                        <div className="flex items-center gap-2">
                                            {status === 'PENDING' && (
                                                <>
                                                    <button onClick={async () => {
                                                        const ok = await confirm({
                                                            title: 'Approve Payout',
                                                            message: `Approve ${amount} EGP payout to ${owner}? This will deduct the funds permanently.`,
                                                            confirmLabel: 'Approve',
                                                            type: 'success'
                                                        });
                                                        if (ok) updateStatus(id, 'PAID');
                                                    }} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                        <CheckCircle2 size={12} />
                                                    </button>
                                                    <button onClick={async () => {
                                                        const note = window.prompt("Reason for rejection (optional):");
                                                        if (note !== null) {
                                                            updateStatus(id, 'REJECTED', note);
                                                        }
                                                    }} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                                                        <XCircle size={12} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Actions */}
                                <div className="hidden md:flex items-center gap-8">
                                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border", getStatusStyles(status))}>
                                        {status}
                                    </span>
                                    <span className="px-2 py-1 text-sm font-bold text-near-black w-24 text-right">
                                        {amount} <span className="text-[10px] text-text-muted font-normal">EGP</span>
                                    </span>
                                    <div className="flex items-center gap-2 w-20 justify-end">
                                        {status === 'PENDING' ? (
                                            <>
                                                <button
                                                    onClick={async () => {
                                                        const ok = await confirm({
                                                            title: 'Approve Payout',
                                                            message: `Approve ${amount} EGP payout to ${owner}? This will permanently deduct the funds from their wallet.`,
                                                            confirmLabel: 'Approve & Pay',
                                                            type: 'success'
                                                        });
                                                        if (ok) updateStatus(id, 'PAID');
                                                    }}
                                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-200"
                                                    title="Approve Payout"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const note = window.prompt("Reason for rejection (optional):");
                                                        if (note !== null) {
                                                            updateStatus(id, 'REJECTED', note);
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border border-rose-200"
                                                    title="Reject Payout"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-[72px]"></div>
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

export default CMSPayoutsPage;
