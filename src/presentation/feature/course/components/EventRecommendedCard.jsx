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
        <div className="glass group p-4 rounded-2xl flex gap-4 transition-all duration-300 hover:border-accent-primary/30">
            {/* Small Cover */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5">
                <img src={cover} alt={title} className="w-full h-full object-cover transition-all duration-500" />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-bold uppercase text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-full">
                            {type}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                            {price === 0 ? 'FREE' : `$${price}`}
                        </span>
                    </div>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-1 group-hover:text-accent-primary transition-colors">
                        {title}
                    </h4>
                    <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {startDate.toLocaleDateString()}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-[9px] text-text-muted">
                        <Users size={10} className="text-accent-primary" />
                        <span>{registeredCount} Joined</span>
                    </div>
                    <button className="text-accent-primary text-[10px] font-bold flex items-center gap-1 hover:underline">
                        JOIN <ExternalLink size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};
