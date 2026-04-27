import React, { useEffect, useState } from 'react';
import { Loader2, CalendarClock, Clock, AlertCircle, Plus } from 'lucide-react';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { useCreateEventActivity } from '@domain/useCase/useCreateEventActivity';

/**
 * EventActivitiesEditor: Displays and orchestrates the itinerary of an event.
 */
export const EventActivitiesEditor = ({ eventId }) => {
    const { fetchEvent, event, loading } = useFetchEvent();
    const { createEventActivity, inProgress } = useCreateEventActivity();

    // Form State
    const [title, setTitle] = useState('');
    const [from, setFrom] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEventActivity({
                title,
                from,
                description,
                eventId: event.id
            });
            // Reset form
            setTitle('');
            setFrom('');
            setDescription('');
            // Refresh list
            fetchEvent(eventId);
        } catch (e) {
            // Toast is handled in UseCase
        }
    };

    if (loading && !event) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Constructing Itinerary...</p>
            </div>
        );
    }

    if (!event) return null;

    const activities = event.activities || [];

    return (
        <div className="animation-fade-in space-y-8">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shadow-inner">
                    <CalendarClock size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Event Itinerary</h2>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                        Schedule and sequencing protocols for this event.
                    </p>
                </div>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-[2.5rem] bg-surface-dark border border-border-subtle shadow-inner flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <Plus size={18} className="text-accent-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Add Itinerary Segment</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Segment Title / Topic *</label>
                        <input 
                            required 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Opening Keynote" 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Start Time (Optional)</label>
                        <input 
                            type="time" 
                            value={from} 
                            onChange={e => setFrom(e.target.value)} 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all tabular-nums"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Description (Optional)</label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        rows={3}
                        placeholder="Brief overview of this timeline segment..."
                        className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={inProgress || !title}
                        className="bg-accent-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                    >
                        {inProgress ? <Loader2 size={16} className="animate-spin" /> : 'Append to Timeline'}
                    </button>
                </div>
            </form>

            {activities.length === 0 ? (
                <div className="bg-surface-sunken/30 border border-dashed border-border-default rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <CalendarClock size={48} className="text-text-muted opacity-20 mb-4" />
                    <p className="font-bold text-text-primary">No activities charted.</p>
                    <p className="text-xs text-text-muted mt-2 max-w-sm">
                        Agenda segments have not been defined in the primary event metadata. Please update the master schema.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {activities.map((activity, index) => (
                        <div key={activity.id || index} className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-surface border border-border-subtle relative overflow-hidden group hover:border-accent-primary/40 transition-colors shadow-whisper">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity text-accent-primary">
                                <Clock size={80} />
                            </div>

                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-sunken border border-border-subtle relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{activity.time || 'TBD'}</span>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                                <h3 className="text-lg font-bold text-text-primary truncate">{activity.title}</h3>
                                {activity.description ? (
                                    <p className="text-sm text-text-muted mt-1 line-clamp-2 md:line-clamp-none leading-relaxed">
                                        {activity.description}
                                    </p>
                                ) : (
                                    <div className="flex items-center gap-2 mt-2 text-status-warning/60 text-xs font-medium">
                                        <AlertCircle size={14} />
                                        <span className="italic">No detailed synopsis provided.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
