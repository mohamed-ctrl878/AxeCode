import React from 'react';
import { Calendar, Users, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * EventRecommendedCard: Visual representation of CardEventEntity.
 * Designed for recommendation sidebars or horizontal lists.
 */
export const EventRecommendedCard = ({ event }) => {
    const { 
        title, 
        type, 
        startDate, 
        endDate, 
        location, 
        cover, 
        price, 
        registeredCount 
    } = event;

    return (
        <div className="bg-surface-elevated group p-4 rounded-sm border border-border-subtle flex gap-4 transition-all duration-200 hover:border-border-default">
            {/* Small Cover */}
            <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 border border-border-subtle">
                {cover ? (
                    <img src={cover} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-sunken">
                        <Calendar size={20} className="text-text-muted opacity-50" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-bold uppercase text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">
                            {type}
                        </span>
                        <span className={cn(
                            "text-[10px] font-mono font-bold",
                            price === 0 ? "text-accent-emerald" : "text-text-muted"
                        )}>
                            {price === 0 ? 'FREE' : `$${price}`}
                        </span>
                    </div>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-1 group-hover:text-accent-blue transition-colors duration-200">
                        {title}
                    </h4>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {startDate?.toLocaleDateString() || 'TBA'}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-[9px] text-text-muted">
                        <Users size={10} className="text-accent-violet" />
                        <span>{registeredCount} Joined</span>
                    </div>
                    <button className="text-accent-blue text-[10px] font-bold flex items-center gap-1 hover:underline transition-all duration-200">
                        JOIN <ExternalLink size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};
