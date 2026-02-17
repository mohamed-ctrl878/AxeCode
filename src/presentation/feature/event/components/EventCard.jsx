import React from 'react';
import { cn } from '@core/utils/cn';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

/**
 * EventCard: UI for displaying professional events.
 * Features a thematic layout with status indicators and action buttons.
 */
export const EventCard = ({ event, className }) => {
    if (!event) return null;

    const isActive = event.isActive;

    return (
        <div className={cn(
            "bento-card  overflow-hidden bg-card border border-border-subtle rounded-3xl transition-all duration-500 hover:border-accent-primary/40 group",
            className
        )}>
            {/* Cover / Visual Header */}
            <div className="relative h-48 bg-surface-dark overflow-hidden">
                {event.cover?.url ? (
                    <img src={event.cover.url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-background border-b border-border-subtle">
                        <Calendar size={48} className="text-border-subtle opacity-50" />
                    </div>
                )}
                
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[10px] font-mono text-accent-primary uppercase tracking-widest border border-accent-primary/20">
                        {event.type || 'Event'}
                    </span>
                    {isActive && (
                        <span className="px-3 py-1 bg-accent-primary/20 backdrop-blur-md rounded-full text-[10px] font-mono text-accent-primary uppercase tracking-widest border border-accent-primary/30 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary glow-pulse" />
                            Live
                        </span>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col gap-4">
                <div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-accent-primary transition-colors">
                        {event.title || 'Knowledge Exchange Workshop'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-text-muted">
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                            <Calendar size={14} className="text-accent-primary" />
                            <span>{event.displayDateRange}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                            <MapPin size={14} className="text-accent-primary" />
                            <span>{event.location || 'Remote'}</span>
                        </div>
                    </div>
                </div>

                {/* Meta & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Users size={16} className="text-text-muted" />
                            <span className="text-xs font-mono text-text-primary">{event.registeredCount || 0} Joined</span>
                        </div>
                        <div className="text-xs font-mono text-accent-primary font-bold">
                            {event.price ? `$${event.price}` : 'FREE'}
                        </div>
                    </div>
                    
                    <button className="px-5 py-2 rounded-full btn-primary text-xs">
                        <span>Register Now</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
