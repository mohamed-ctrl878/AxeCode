import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, QrCode, Shield, Plus, ShieldCheck, Search, User, X } from 'lucide-react';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { useCreateEventScanner } from '@domain/useCase/useCreateEventScanner';
import { UserRepository } from '@infrastructure/repository/UserRepository';

/**
 * EventScannersEditor: Authorizes and manages users who can scan event tickets.
 */
export const EventScannersEditor = ({ eventId }) => {
    const { fetchEvent, event, loading } = useFetchEvent();
    const { createEventScanner, inProgress } = useCreateEventScanner();
    const userRepo = useMemo(() => new UserRepository(), []);

    // Form State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await userRepo.search(searchQuery);
                setSearchResults(results);
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, userRepo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await createEventScanner({
                targetUserId: selectedUser.id,
                eventId: event.id
            });
            // Reset
            setSearchQuery('');
            setSearchResults([]);
            setSelectedUser(null);
            // Refresh
            fetchEvent(eventId);
        } catch (e) {
            // Error managed by useCase
        }
    };

    if (loading && !event) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Verifying Authorities...</p>
            </div>
        );
    }

    if (!event) return null;

    // Use event.scanners if available, otherwise just default to empty array
    const scanners = event.scanners || [];

    return (
        <div className="animation-fade-in space-y-8">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shadow-inner">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Ticket Scanners</h2>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                        Authorize personnel to scan tickets for this event.
                    </p>
                </div>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-[2.5rem] bg-surface-dark border border-border-subtle shadow-inner flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <Plus size={18} className="text-accent-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Authorize Personnel</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 relative">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Search User by Username *</label>
                        
                        {!selectedUser ? (
                            <div className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                    placeholder="Type to search users..." 
                                    className="w-full bg-surface-sunken border border-border-subtle rounded-2xl pl-10 pr-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all"
                                />
                                {isSearching && (
                                    <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-primary animate-spin" />
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-accent-primary/10 border border-accent-primary/30 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                                        <User size={14} className="text-accent-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-text-primary">{selectedUser.username}</span>
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest">ID: {selectedUser.documentId || selectedUser.id}</span>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => { setSelectedUser(null); setSearchQuery(''); }}
                                    className="p-2 hover:bg-surface rounded-full text-text-muted hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        
                        {!selectedUser && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto">
                                {searchResults.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => setSelectedUser(user)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-sunken transition-colors text-left border-b border-border-subtle last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-surface-sunken flex items-center justify-center">
                                            <User size={14} className="text-text-muted" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-primary">{user.username}</span>
                                            <span className="text-[10px] text-text-muted">{user.email}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={inProgress || !selectedUser}
                        className="bg-accent-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                    >
                        {inProgress ? <Loader2 size={16} className="animate-spin" /> : 'Grant Authority'}
                    </button>
                </div>
            </form>

            {scanners.length === 0 ? (
                <div className="bg-surface-sunken/30 border border-dashed border-border-default rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <QrCode size={48} className="text-text-muted opacity-20 mb-4" />
                    <p className="font-bold text-text-primary">No authorized scanners.</p>
                    <p className="text-xs text-text-muted mt-2 max-w-sm">
                        No personnel have been granted scanning privileges for this event.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scanners.map((scanner, index) => {
                        const user = scanner.user;
                        const identifier = user?.username || user?.email || `Scanner #${scanner.id}`;
                        const displayId = user?.id || scanner.id;
                        
                        return (
                            <div key={scanner.id || index} className="flex flex-col gap-4 p-6 rounded-3xl bg-surface border border-border-subtle relative overflow-hidden group hover:border-accent-primary/40 transition-colors shadow-whisper">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity text-accent-primary">
                                    <Shield size={64} />
                                </div>
    
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-sunken border border-border-subtle flex items-center justify-center">
                                        <QrCode size={20} className="text-text-muted" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[15px] font-bold text-text-primary truncate">{identifier}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full font-mono">ID: {displayId}</span>
                                            {user?.email && <span className="text-[10px] text-text-muted truncate">{user.email}</span>}
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Authorized Scanner</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
