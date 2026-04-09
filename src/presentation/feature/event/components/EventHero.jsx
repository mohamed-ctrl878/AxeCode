import React from 'react';
import { Calendar, MapPin, Users, MonitorPlay, Building2 } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * EventHero - Stunning top section for the event.
 * Displays cover image, title, tags, and key metadata.
 * 
 * @param {Object} props
 * @param {import('@domain/entity/EventEntity').EventEntity} props.event
 */
export const EventHero = ({ event }) => {
    if (!event) return null;

    const EVENT_TYPE_ICONS = {
        'Onsite': <Building2 size={16} />,
        'Live': <MonitorPlay size={16} />,
        'Hybrid': <MapPin size={16} /> // Represents both
    };

    return (
        <div className="relative rounded-[32px] overflow-hidden bg-surface border border-border-subtle shadow-2xl group animate-fade-in">
            {/* Cover Image */}
            <div className="w-full h-[40vh] md:h-[50vh] min-h-[300px] relative">
                {event.cover?.url ? (
                    <img 
                        src={event.cover.url} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-dark to-surface flex items-center justify-center">
                        <Calendar size={64} className="text-border-subtle" />
                    </div>
                )}
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md",
                        event.type === 'Onsite' ? "bg-accent-blue/80 border border-accent-blue/30" :
                        event.type === 'Live' ? "bg-status-success/80 border border-status-success/30" :
                        "bg-accent-primary/80 border border-accent-primary/30"
                    )}>
                        {EVENT_TYPE_ICONS[event.type] || <Calendar size={16} />}
                        {event.type}
                    </span>
                    
                    {event.tags?.map((tag, idx) => (
                        <span key={idx} className="px-4 py-1.5 rounded-full text-xs font-bold bg-surface/80 text-text-primary backdrop-blur-md border border-border-subtle">
                            {tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6 drop-shadow-md">
                    {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-text-muted font-medium">
                    <div className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-border-subtle">
                        <Calendar size={18} className="text-accent-primary" />
                        <span>{event.displayDateRange}</span>
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-border-subtle">
                            <MapPin size={18} className="text-accent-primary" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    {event.registeredCount > 0 && (
                        <div className="flex items-center gap-2 bg-surface/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-border-subtle">
                            <Users size={18} className="text-accent-primary" />
                            <span>{event.registeredCount} Registered</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
