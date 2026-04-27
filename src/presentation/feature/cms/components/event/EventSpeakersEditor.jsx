import React, { useEffect, useState } from 'react';
import { Loader2, Mic2, ExternalLink, Plus } from 'lucide-react';
import { useFetchEvent } from '@domain/useCase/useFetchEvent';
import { useCreateEventSpeaker } from '@domain/useCase/useCreateEventSpeaker';

/**
 * EventSpeakersEditor: Manages and displays the roster of speakers.
 */
export const EventSpeakersEditor = ({ eventId }) => {
    const { fetchEvent, event, loading } = useFetchEvent();
    const { createEventSpeaker, inProgress } = useCreateEventSpeaker();

    // Form State
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        if (eventId) {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEventSpeaker({
                name,
                title,
                linkedin,
                userId,
                eventId: event.id
            });
            // Reset
            setName('');
            setTitle('');
            setLinkedin('');
            setUserId('');
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
                <p className="text-[10px] font-black uppercase tracking-widest">Compiling Speaker Roster...</p>
            </div>
        );
    }

    if (!event) return null;

    const speakers = event.speakers || [];

    return (
        <div className="animation-fade-in space-y-8">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shadow-inner">
                    <Mic2 size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Speaker Roster</h2>
                    <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                        Subject matter experts and keynotes associated with this event.
                    </p>
                </div>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-[2.5rem] bg-surface-dark border border-border-subtle shadow-inner flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <Plus size={18} className="text-accent-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Appoint Speaker</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Full Name *</label>
                        <input 
                            required 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g. John Doe" 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Professional Title *</label>
                        <input 
                            required 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Senior Software Engineer" 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Internal User ID (Optional)</label>
                        <input 
                            type="number" 
                            value={userId} 
                            onChange={e => setUserId(e.target.value)} 
                            placeholder="System User Document ID" 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all tabular-nums"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">LinkedIn URL (Optional)</label>
                        <input 
                            type="url" 
                            value={linkedin} 
                            onChange={e => setLinkedin(e.target.value)} 
                            placeholder="https://linkedin.com/in/username" 
                            className="bg-surface-sunken border border-border-subtle rounded-2xl px-4 py-3 text-sm text-text-primary focus:border-accent-primary/50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        disabled={inProgress || !name || !title}
                        className="bg-accent-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-accent-primary/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                    >
                        {inProgress ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Assignment'}
                    </button>
                </div>
            </form>

            {speakers.length === 0 ? (
                <div className="bg-surface-sunken/30 border border-dashed border-border-default rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <Mic2 size={48} className="text-text-muted opacity-20 mb-4" />
                    <p className="font-bold text-text-primary">No speakers designated.</p>
                    <p className="text-xs text-text-muted mt-2 max-w-sm">
                        The roster is currently empty. Define speaker details in the primary event metadata schema to populate this list.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {speakers.map((speaker, index) => (
                        <div key={speaker.id || index} className="p-6 rounded-3xl bg-surface border border-border-subtle relative group hover:border-accent-primary/40 transition-colors shadow-whisper flex flex-col items-center text-center">
                            
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full border-2 border-border-subtle overflow-hidden mb-4 bg-surface-sunken flex items-center justify-center group-hover:border-accent-primary/50 transition-colors">
                                {speaker.avatar ? (
                                    <img src={speaker.avatar} alt={speaker.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Mic2 size={24} className="text-text-muted opacity-40" />
                                )}
                            </div>
                            
                            {/* Info */}
                            <h3 className="text-lg font-bold text-text-primary mb-1">{speaker.name}</h3>
                            <p className="text-xs text-accent-primary font-medium uppercase tracking-widest mb-4">
                                {speaker.title || 'Guest Speaker'}
                            </p>

                            {/* Links */}
                            {speaker.linkedin && (
                                <a 
                                    href={speaker.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-auto flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-accent-primary transition-colors px-4 py-2 rounded-xl bg-surface-sunken/50 hover:bg-accent-primary/10"
                                >
                                    View Profile <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
