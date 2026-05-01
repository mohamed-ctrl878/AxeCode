import React from 'react';
import { Bell, CheckCircle2, Clock, Eye, RefreshCw, Database } from 'lucide-react';
import { useFetchAdminNotifications } from '@domain/useCase/useFetchAdminNotifications';
import { cn } from '@core/utils/cn';

/**
 * CMSAdminNotificationsPage - Admin panel for viewing platform-level notifications.
 * Consumes the admin-notification backend API.
 */
const CMSAdminNotificationsPage = () => {
    const { notifications, isLoading, fetch, markRead, updateStatus, statusFilter, setStatusFilter } = useFetchAdminNotifications();

    const statusTabs = [
        { id: null, label: 'All', icon: Eye },
        { id: 'PENDING', label: 'Pending', icon: Clock },
        { id: 'RESOLVED', label: 'Resolved', icon: CheckCircle2 }
    ];

    return (
        <div className="space-y-8 animation-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-ivory p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-border-default shadow-whisper">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200">
                        <Bell size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-near-black">Admin Alerts</h2>
                        <p className="text-[11px] text-text-muted font-serif italic mt-1">Platform-level alerts: reported content, system events.</p>
                    </div>
                </div>
                <button onClick={fetch} disabled={isLoading} className="p-3 rounded-2xl bg-surface-sunken border border-border-default text-text-muted hover:text-near-black transition-all">
                    <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
                </button>
            </div>

            {/* Status Filter */}
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
                                isActive ? "bg-near-black text-ivory shadow-lg" : "text-text-muted hover:bg-surface-sunken hover:text-near-black"
                            )}
                        >
                            <TabIcon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Notifications List */}
            <div className="bg-ivory border border-border-default rounded-[32px] shadow-whisper overflow-hidden">
                <div className="bg-parchment/80 px-4 md:px-8 py-3 md:py-4 border-b border-border-default">
                    <span className="text-[11px] font-bold text-near-black/50 font-serif uppercase tracking-[0.3em]">Admin Notification Feed</span>
                </div>

                <div className="divide-y divide-border-subtle/50 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-pulse">
                            <RefreshCw size={40} className="animate-spin text-near-black/20" />
                            <p className="text-[11px] font-bold text-near-black/40 font-serif uppercase tracking-[0.3em]">Loading alerts...</p>
                        </div>
                    ) : (!Array.isArray(notifications) || notifications.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-40">
                            <Database size={60} className="text-text-muted" />
                            <p className="text-lg font-serif font-bold text-near-black">No Alerts</p>
                            <p className="text-[11px] font-serif italic">All clear — no pending admin notifications.</p>
                        </div>
                    ) : notifications.map((notif, idx) => {
                        const id = notif?.documentId || notif?.id || `notif-${idx}`;
                        const type = notif?.type || 'unknown';
                        const contentType = notif?.content_type || '';
                        const status = notif?.status || 'PENDING';
                        const isRead = notif?.read || false;
                        const message = notif?.message_en || notif?.message_ar || `${type} on ${contentType}`;
                        const actorName = notif?.actor?.username || 'System';
                        const dateStr = notif?.createdAt
                            ? new Date(notif.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '';

                        return (
                            <div key={id} className={cn("px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-parchment/40 transition-all group", !isRead && "bg-amber-50/30")}>
                                <div className="flex items-start md:items-center gap-4 md:gap-5 w-full md:w-auto flex-1 min-w-0">
                                    <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1.5 md:mt-0", !isRead ? "bg-amber-500" : "bg-transparent")} />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-serif font-bold text-near-black break-words md:truncate">{message}</div>
                                        <div className="text-[10px] text-text-muted font-serif italic mt-0.5 truncate">
                                            By {actorName} · {dateStr} {/*· {contentType}*/}
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Actions / Statuses */}
                                    <div className="flex md:hidden flex-col items-end gap-2 shrink-0">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border",
                                            status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                                        )}>
                                            {status}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {!isRead && (
                                                <button onClick={() => markRead(id)} className="p-1.5 rounded-lg text-text-muted hover:bg-surface-sunken border border-border-subtle" title="Mark as read">
                                                    <Eye size={12} />
                                                </button>
                                            )}
                                            {status === 'PENDING' && (
                                                <button onClick={() => updateStatus(id, 'RESOLVED')} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200" title="Resolve">
                                                    <CheckCircle2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Actions */}
                                <div className="hidden md:flex items-center gap-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                                        status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                                    )}>
                                        {status}
                                    </span>
                                    {!isRead && (
                                        <button onClick={() => markRead(id)} className="p-2 rounded-lg text-text-muted hover:bg-surface-sunken transition-all" title="Mark as read">
                                            <Eye size={14} />
                                        </button>
                                    )}
                                    {status === 'PENDING' && (
                                        <button onClick={() => updateStatus(id, 'RESOLVED')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-200" title="Resolve">
                                            <CheckCircle2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CMSAdminNotificationsPage;
