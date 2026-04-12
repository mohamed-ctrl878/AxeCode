import React, { useCallback } from 'react';
import { CalendarClock, MapPin, Tag, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { useCreateUserEntitlement } from '@domain/useCase/useCreateUserEntitlement';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

/**
 * EventInfoSidebar - Sticky sidebar with key metrics and CTA.
 * 
 * @param {Object} props
 * @param {import('@domain/entity/EventEntity').EventEntity} props.event
 * @param {Function} props.onRefresh
 */
export const EventInfoSidebar = ({ event, onRefresh }) => {
    const { createUserEntitlement, inProgress, error } = useCreateUserEntitlement();
    const navigate = useNavigate();
    
    if (!event) return null;

    const isFree = !event.price || Number(event.price) === 0;

    const handleRegister = useCallback(async () => {
        if (event.hasAccess || inProgress) return;

        if (isFree) {
            try {
                await createUserEntitlement({
                    productId: event.entitlementsId,
                    content_types: 'event' // Matches backend mapping for events
                });
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error('Registration failed:', err);
            }
        } else {
            alert('This is a ticketed event. Ticketing system integration is coming in the next release.');
        }
    }, [event, isFree, inProgress, createUserEntitlement, onRefresh]);

    return (
        <div className="bento-card p-6 bg-surface border border-border-subtle rounded-3xl sticky top-24 shadow-xl flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Price & CTA */}
            <div className="flex flex-col gap-4 pb-6 border-b border-border-subtle">
                <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Ticket</span>
                    <span className="text-3xl font-black text-accent-primary">
                        {isFree ? 'FREE' : `$${event.price}`}
                    </span>
                </div>
                <button 
                    onClick={handleRegister}
                    disabled={event.hasAccess || inProgress}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {inProgress ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : event.hasAccess ? (
                        'Registered ✅'
                    ) : (
                        'Register Now'
                    )}
                </button>
                {error && <p className="text-[10px] text-center text-status-error font-bold">{error}</p>}
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                    <ShieldCheck size={14} className="text-status-success" />
                    <span>Secure Registration via AxeCode</span>
                </div>
            </div>

            {/* Event Details List */}
            <div className="flex flex-col gap-5">
                <h4 className="font-bold text-text-primary uppercase tracking-widest text-sm mb-2">Event Details</h4>
                
                <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-background transition-all shadow-sm">
                        <CalendarClock size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Date & Time</span>
                        <span className="text-sm font-medium text-text-primary">{event.displayDateRange}</span>
                        {event.duration && <span className="text-xs text-text-muted mt-0.5">{event.duration} Minutes</span>}
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-background transition-all shadow-sm">
                        <MapPin size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Location / Format</span>
                        <span className="text-sm font-medium text-text-primary">{event.location || event.type}</span>
                    </div>
                </div>

                {event.organizer && (
                    <div 
                        className="flex items-start gap-4 group cursor-pointer hover:opacity-80 transition-opacity w-fit"
                        onClick={() => {
                            if (event.organizer?.username) {
                                navigate(PATHS.PROFILE.replace(':username', event.organizer.username));
                            }
                        }}
                    >
                        <div className="w-10 h-10 rounded-full bg-surface-sunken flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-background transition-all shadow-sm overflow-hidden border border-border-subtle">
                            {event.organizer.avatar ? (
                                <img src={event.organizer.avatar.url} alt="Organizer" className="w-full h-full object-cover" />
                            ) : (
                                <Users size={20} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Organizer</span>
                            <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">{event.organizer.username}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
