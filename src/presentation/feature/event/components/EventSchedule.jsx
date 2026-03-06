import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

/**
 * EventSchedule - Displays the event activities/agenda as a timeline.
 * 
 * @param {Object} props
 * @param {Array<import('@domain/entity/EventEntity').EventEntity['activities'][0]>} props.activities
 */
export const EventSchedule = ({ activities }) => {
    if (!activities || activities.length === 0) return null;

    const renderDescription = (desc) => {
        if (!desc) return null;
        if (typeof desc === 'string') return desc;
        if (Array.isArray(desc)) {
            return desc.flatMap(block => block?.children || [])
                       .map(child => child?.text || '')
                       .join('\n');
        }
        return JSON.stringify(desc);
    };

    return (
        <div className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div className="p-3 bg-accent-primary/10 rounded-xl text-accent-primary">
                    <CalendarDays size={24} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Event Schedule</h3>
            </div>

            <div className="relative border-l border-border-subtle ml-6 space-y-8 py-4">
                {activities.map((activity, index) => (
                    <div key={activity.id || index} className="relative pl-8 group">
                        {/* Timeline Node */}
                        <div className="absolute -left-2.5 top-1.5 w-5 h-5 bg-surface border-2 border-accent-primary rounded-full group-hover:scale-110 group-hover:bg-accent-primary transition-all shadow-sm" />
                        
                        <div className="bento-card p-5 bg-surface-light/30 border border-border-subtle rounded-3xl hover:border-accent-primary/30 transition-all hover:shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                                <h4 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                                    {activity.title}
                                </h4>
                                {activity.time && (
                                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-lg">
                                        <Clock size={12} />
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            {activity.description && (
                                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                                    {renderDescription(activity.description)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
