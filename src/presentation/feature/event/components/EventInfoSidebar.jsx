import React from 'react';
import { CalendarClock, MapPin, Tag, Users, ShieldCheck } from 'lucide-react';

/**
 * EventInfoSidebar - Sticky sidebar with key metrics and CTA.
 * 
 * @param {Object} props
 * @param {import('@domain/entity/EventEntity').EventEntity} props.event
 */
export const EventInfoSidebar = ({ event }) => {
    if (!event) return null;

    const isFree = !event.price || event.price === 0;

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
                    disabled={event.hasAccess}
                    className="w-full py-4 rounded-xl bg-accent-primary hover:bg-accent-hover text-white font-bold text-lg transition-all shadow-lg hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {event.hasAccess ? 'Registered ✅' : 'Register Now'}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                    <ShieldCheck size={14} className="text-status-success" />
                    <span>Secure Registration via AxeCode</span>
                </div>
            </div>

            {/* Event Details List */}
            <div className="flex flex-col gap-5">
                <h4 className="font-bold text-text-primary uppercase tracking-widest text-sm mb-2">Event Details</h4>
                
                <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all shadow-sm">
                        <CalendarClock size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Date & Time</span>
                        <span className="text-sm font-medium text-text-primary">{event.displayDateRange}</span>
                        {event.duration && <span className="text-xs text-text-muted mt-0.5">{event.duration} Minutes</span>}
                    </div>
                </div>

                <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all shadow-sm">
                        <MapPin size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Location / Format</span>
                        <span className="text-sm font-medium text-text-primary">{event.location || event.type}</span>
                    </div>
                </div>

                {event.organizer && (
                    <div className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-surface-dark flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all shadow-sm overflow-hidden">
                            {event.organizer.avatar ? (
                                <img src={event.organizer.avatar.url} alt="Organizer" className="w-full h-full object-cover" />
                            ) : (
                                <Users size={20} />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Organizer</span>
                            <span className="text-sm font-medium text-text-primary">{event.organizer.username}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
