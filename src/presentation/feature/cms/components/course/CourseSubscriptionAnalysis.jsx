import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Loader2, CheckCircle, AlertCircle, Search, User, Activity, Users } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { useFetchUserEntitlements } from '@domain/useCase/useFetchUserEntitlements';
import { useCreateUserEntitlement } from '@domain/useCase/useCreateUserEntitlement';
import { useDeleteUserEntitlement } from '@domain/useCase/useDeleteUserEntitlement';
import { useSearchUsers } from '@domain/useCase/useSearchUsers';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { UserEntitlementRequest } from '@infrastructure/DTO/Request/UserEntitlementRequest';
import { SubscriptionChart } from './SubscriptionChart';

/**
 * CourseSubscriptionAnalysis: Manages actual student enrollments via user-entitlements.
 * Synchronized with course.entitlementsId (productId).
 */
export const CourseSubscriptionAnalysis = ({ courseId }) => {
    // ─── UseCases ────────────────────────────────────────────────────────
    const { fetchCoursePreview, coursePreview, loading: isFetchingCourse } = useFetchCoursePreview();
    const { fetchUserEntitlements, userEntitlements, loading: isFetchingSubscribers } = useFetchUserEntitlements();
    const { createUserEntitlement, inProgress: isCreating } = useCreateUserEntitlement();
    const { deleteUserEntitlement, inProgress: isDeleting } = useDeleteUserEntitlement();
    const { searchUsers, foundUser, loading: isSearching } = useSearchUsers();

    // ─── Local State ─────────────────────────────────────────────────────
    const [emailSearch, setEmailSearch] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [activeFilter, setActiveFilter] = useState('all'); // all, 3m, 1m, 7d

    // ─── Initial Load ────────────────────────────────────────────────────
    useEffect(() => {
        if (courseId) {
            fetchCoursePreview(courseId);
        }
    }, [courseId]);

    // Fetch subscribers once course details (and entitlementsId) are known
    useEffect(() => {
        if (coursePreview?.entitlementsId) {
            fetchUserEntitlements(coursePreview.entitlementsId);
        }
    }, [coursePreview, fetchUserEntitlements]);

    // ─── Actions ─────────────────────────────────────────────────────────
    const handleGrantAccess = async () => {
        if (!emailSearch) return;
        if (!coursePreview?.entitlementsId) {
            showStatus('error', 'Course is missing an Entitlements ID (productId).');
            return;
        }

        try {
            const user = await searchUsers(emailSearch);
            if (!user) {
                showStatus('error', 'User not found with this email.');
                return;
            }

            // Check if user already has access in the local list
            const exists = userEntitlements.some(e => 
                (e.user?.id === user.id)
            );

            if (exists) {
                showStatus('error', 'This user is already enrolled.');
                return;
            }

            const request = new UserEntitlementRequest({
                productId: coursePreview.entitlementsId,
                userId: user.id,
                contentType: 'course',
                status: 'successed'
            });

            await createUserEntitlement(request.toJSON());
            showStatus('success', `Grant confirmed for ${user.username || user.email}`);
            setEmailSearch('');
            fetchUserEntitlements(coursePreview.entitlementsId); // Refresh list
        } catch (err) {
            showStatus('error', 'Failed to grant enrollment.');
        }
    };

    const handleRevokeAccess = async (recordId) => {
        if (!window.confirm('Are you sure you want to revoke this student\'s access?')) return;
        
        try {
            await deleteUserEntitlement(recordId);
            showStatus('success', 'Enrollment revoked successfully.');
            fetchUserEntitlements(coursePreview.entitlementsId); // Refresh list
        } catch (err) {
            showStatus('error', 'Failed to revoke enrollment.');
        }
    };

    const showStatus = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    };

    // ─── UI Helpers ─────────────────────────────────────────────────────
    const isLoading = isFetchingCourse || isFetchingSubscribers;

    if (isLoading && !coursePreview) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Analyzing subscription metrics...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade-in space-y-10 pb-20">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shadow-inner">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white italic">Subscription Analysis</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                            Ownership & Enrollment Metrics | Product ID: <span className="text-accent-blue font-mono">{coursePreview?.entitlementsId || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Time Filters */}
                    <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                        {[
                            { id: 'all', label: 'All Time' },
                            { id: '3m', label: '3 Months' },
                            { id: '1m', label: '1 Month' },
                            { id: '7d', label: '7 Days' }
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeFilter === f.id 
                                        ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/20" 
                                        : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {statusMessage.text && (
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold animation-slide-up",
                            statusMessage.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )}>
                            {statusMessage.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            {statusMessage.text}
                        </div>
                    )}
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <SubscriptionChart data={userEntitlements} filter={activeFilter} />
                </div>
                <div className="space-y-6">
                    <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group hover:border-accent-blue/20 transition-all backdrop-blur-sm h-full max-h-[110px]">
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Active Subscribers</p>
                            <p className="text-3xl font-black text-white">{userEntitlements.length}</p>
                        </div>
                        <Users size={32} className="text-accent-blue opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="bg-surface-dark/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group hover:border-green-500/20 transition-all backdrop-blur-sm h-full max-h-[110px]">
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Status</p>
                            <p className="text-2xl font-black text-green-400 uppercase tracking-tighter">Healthy</p>
                        </div>
                        <Activity size={32} className="text-green-400 opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Grant New Enrollment */}
                <div className="bg-surface-dark/40 border border-white/5 rounded-3xl p-8 space-y-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <UserPlus size={120} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">Manual Enrollment Ledger</h3>
                        <p className="text-[10px] text-text-muted italic">Bestow access via direct product ID association.</p>
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
                                placeholder="Enter student email address..."
                                className="w-full bg-background/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-white focus:border-accent-blue/50 outline-none transition-all shadow-inner"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 size={16} className="animate-spin text-accent-blue" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleGrantAccess}
                            disabled={isCreating || !emailSearch || !coursePreview?.entitlementsId}
                            className="h-14 px-10 bg-accent-blue text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-accent-blue/50 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-20"
                        >
                            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                            Grant Instant Access
                        </button>
                    </div>
                </div>

                {/* Active Enrollment List */}
                <div className="bg-surface-dark/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl min-h-[400px]">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Search size={16} className="text-text-muted" />
                            <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em]">Ownership ledger</h3>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted/40 uppercase">Total: {userEntitlements.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-white/[0.01]">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">Student Identity</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">Status</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">Start Date</th>
                                    <th className="px-8 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {userEntitlements.map((entry) => {
                                    const user = entry?.user;
                                    const userLabel = user?.username || user?.email || `ID: ${user?.id}`;
                                    const userEmail = user?.email || '';
                                    
                                    return (
                                        <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white/40">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">{userLabel}</p>
                                                        <p className="text-[10px] text-text-muted opacity-60 font-mono italic">{userEmail || 'System Entity'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                                    entry.status === 'successed' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                                                    entry.status === 'pinding' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    {entry.status === 'successed' ? 'Enrolled' : entry.status}
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
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-20"
                                                    title="Revoke Enrollment"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {userEntitlements.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <Users size={48} />
                                                <p className="text-sm font-mono tracking-tight text-text-muted">No ownership records found for this Product ID.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
