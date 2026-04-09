import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Loader2, CheckCircle, AlertCircle, Search, User as UserIcon, Activity, Users } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useFetchUserEntitlements } from '@domain/useCase/useFetchUserEntitlements';
import { useCreateUserEntitlement } from '@domain/useCase/useCreateUserEntitlement';
import { useDeleteUserEntitlement } from '@domain/useCase/useDeleteUserEntitlement';
import { useSearchUsers } from '@domain/useCase/useSearchUsers';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { UserEntitlementRequest } from '@infrastructure/DTO/Request/UserEntitlementRequest';
import { SubscriptionChart } from '../shared/SubscriptionChart';

/**
 * EventSubscriptionAnalysis: Manages actual event registrations via user-entitlements.
 */
export const EventSubscriptionAnalysis = ({ eventId }) => {
    // ─── UseCases ────────────────────────────────────────────────────────
    const { fetchEvent, event, loading: isFetchingEvent } = useFetchEvent();
    const { fetchUserEntitlements, userEntitlements, loading: isFetchingSubscribers } = useFetchUserEntitlements();
    const { createUserEntitlement, inProgress: isCreating } = useCreateUserEntitlement();
    const { deleteUserEntitlement, inProgress: isDeleting } = useDeleteUserEntitlement();
    const { searchUsers, loading: isSearching } = useSearchUsers();

    // ─── Local State ─────────────────────────────────────────────────────
    const [emailSearch, setEmailSearch] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [activeFilter, setActiveFilter] = useState('all');

    // ─── Initial Load ────────────────────────────────────────────────────
    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    // Fetch subscribers once event details (and entitlementsId) are known
    useEffect(() => {
        if (event?.entitlementsId) {
            fetchUserEntitlements(event.entitlementsId);
        }
    }, [event, fetchUserEntitlements]);

    // ─── Actions ─────────────────────────────────────────────────────────
    const handleGrantAccess = async () => {
        if (!emailSearch) return;
        if (!event?.entitlementsId) {
            showStatus('error', 'Event is missing an Entitlements ID.');
            return;
        }

        try {
            const user = await searchUsers(emailSearch);
            if (!user) {
                showStatus('error', 'User not found.');
                return;
            }

            const exists = userEntitlements.some(e => (e.user?.id === user.id));
            if (exists) {
                showStatus('error', 'User already registered.');
                return;
            }

            const request = new UserEntitlementRequest({
                productId: event.entitlementsId,
                userId: user.id,
                contentType: 'event', // Identify as event
                status: 'successed'
            });

            await createUserEntitlement(request.toJSON());
            showStatus('success', `Access granted for ${user.username || user.email}`);
            setEmailSearch('');
            fetchUserEntitlements(event.entitlementsId);
        } catch (err) {
            showStatus('error', 'Failed to grant access.');
        }
    };

    const handleRevokeAccess = async (recordId) => {
        if (!window.confirm('Revoke this user\'s access?')) return;
        try {
            await deleteUserEntitlement(recordId);
            showStatus('success', 'Access revoked.');
            fetchUserEntitlements(event.entitlementsId);
        } catch (err) {
            showStatus('error', 'Failed to revoke access.');
        }
    };

    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    };

    if (isFetchingEvent && !event) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Analyzing attendee metrics...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade-in space-y-10 pb-20">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shadow-inner">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-text-primary italic">Attendee Analysis</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                            Product ID: <span className="text-accent-primary font-mono">{event?.entitlementsId || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex p-1 bg-surface border border-border-subtle rounded-xl">
                        {['all', '3m', '1m', '7d'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeFilter === f ? "bg-accent-primary text-on-accent shadow-sm" : "text-text-muted hover:text-text-primary"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {statusMessage.text && (
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animation-slide-up",
                            statusMessage.type === 'success' ? "bg-status-success/10 text-status-success border border-status-success/20" : "bg-status-error/10 text-status-error border border-status-error/20"
                        )}>
                            {statusMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            {statusMessage.text}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <SubscriptionChart data={userEntitlements} filter={activeFilter} accentColor="var(--color-accent-primary)" />
                </div>
                <div className="space-y-6">
                    <div className="bg-surface-sunken border border-border-subtle rounded-[2rem] p-6 flex items-center justify-between group hover:border-accent-primary/20 transition-all backdrop-blur-sm h-full max-h-[110px]">
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Active Attendees</p>
                            <p className="text-3xl font-black text-text-primary">{userEntitlements.length}</p>
                        </div>
                        <Users size={32} className="text-accent-primary opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-surface-dark/40 border border-border-subtle rounded-3xl p-8 space-y-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <UserPlus size={120} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <h3 className="text-xs font-black text-text-primary/90 uppercase tracking-[0.2em]">Manual Registration</h3>
                        <p className="text-[10px] text-text-muted italic">Directly bestow attendance access.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 relative z-10">
                        <div className="flex-1 relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-blue transition-colors">
                                <Mail size={18} />
                            </div>
                            <input 
                                type="email"
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                                placeholder="Enter attendee email..."
                                className="w-full bg-background/50 border border-border-subtle rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-text-primary focus:border-accent-blue/50 outline-none transition-all shadow-inner"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 size={16} className="animate-spin text-accent-blue" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleGrantAccess}
                            disabled={isCreating || !emailSearch || !event?.entitlementsId}
                            className="h-14 px-10 bg-accent-primary text-on-accent font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(52,211,153,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-20"
                        >
                            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                            Invite Attendee
                        </button>
                    </div>
                </div>

                <div className="bg-surface border border-border-subtle rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl min-h-[400px]">
                    <div className="px-8 py-6 border-b border-border-subtle bg-surface-sunken flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Search size={16} className="text-text-muted" />
                            <h3 className="text-xs font-black text-text-primary/90 uppercase tracking-[0.2em]">Attendance Ledger</h3>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted/40 uppercase">Total: {userEntitlements.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-surface-sunken">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border-subtle">Identity</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border-subtle">Status</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border-subtle">Registered</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border-subtle">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {userEntitlements.map((entry) => {
                                    const u = entry?.user;
                                    const userLabel = u?.username || u?.email || `ID: ${u?.id}`;
                                    return (
                                        <tr key={entry.id} className="group hover:bg-surface-hover transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-border-subtle to-transparent flex items-center justify-center text-text-muted/40">
                                                        <UserIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-blue transition-colors">{userLabel}</p>
                                                        <p className="text-[10px] text-text-muted opacity-60 font-mono italic">{u?.email || 'System Entity'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border bg-status-success/10 text-status-success border-status-success/20">
                                                    Registered
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="text-[10px] font-mono text-text-muted">
                                                    {entry.startDate ? entry.startDate.toLocaleDateString() : 'Historical'}
                                                </p>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button 
                                                    onClick={() => handleRevokeAccess(entry.documentId || entry.id)}
                                                    disabled={isDeleting}
                                                    className="p-2.5 rounded-xl bg-status-error/10 text-status-error hover:bg-status-error hover:text-on-accent transition-all shadow-lg active:scale-95 disabled:opacity-20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
