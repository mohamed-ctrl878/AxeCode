import React, { useEffect } from 'react';
import { cn } from '@core/utils/cn';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { useFetchRecommendedEvents } from '@domain/useCase/useFetchRecommendedEvents';

/**
 * EventAds: Displays upcoming event promotions in the feed sidebar.
 * Uses real data from the recommendation API via useFetchRecommendedEvents.
 */
export const EventAds = ({ className }) => {
    const { fetchEvents, events, loading } = useFetchRecommendedEvents();

    useEffect(() => {
        fetchEvents(3);
    }, [fetchEvents]);

    /**
     * Formats a Date object to a short display string (e.g. "Feb 20").
     * @param {Date|string|null} date
     * @returns {string}
     */
    const formatShortDate = (date) => {
        if (!date) return 'TBA';
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-text-muted">Upcoming Events</h3>
            </div>
            
            {loading && (
                <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {events?.map(event => (
                <div key={event.uid} className="bento-card p-4 bg-surface-dark border border-border-subtle rounded-2xl hover:border-accent-primary group transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-accent-primary font-mono uppercase tracking-widest">{event.type}</span>
                        <ArrowUpRight size={14} className="text-text-muted group-hover:text-accent-primary transition-colors" />
                    </div>
                    <h4 className="text-sm font-medium mb-3">{event.title}</h4>
                    <div className="flex items-center gap-2 text-text-muted">
                        <Calendar size={12} />
                        <span className="text-xs font-mono">{formatShortDate(event.startDate)}</span>
                    </div>
                </div>
            ))}

            <div className="mt-4 p-6 rounded-3xl bg-accent-primary/5 border border-accent-primary/20 flex flex-col items-center text-center">
                <p className="text-xs text-accent-primary font-mono mb-2 uppercase">Pro Membership</p>
                <h5 className="text-sm font-bold mb-4">Unlock all problems and courses</h5>
                <button className="w-full btn-primary py-2 rounded-xl text-xs">
                    Upgrade Now
                </button>
            </div>
        </div>
    );
};
