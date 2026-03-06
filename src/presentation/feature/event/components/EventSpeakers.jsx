import React from 'react';
import { Users, Link as LinkIcon } from 'lucide-react';

/**
 * EventSpeakers - Grid of speakers presenting at the event.
 * 
 * @param {Object} props
 * @param {Array<import('@domain/entity/EventEntity').EventEntity['speakers'][0]>} props.speakers
 */
export const EventSpeakers = ({ speakers }) => {
    if (!speakers || speakers.length === 0) return null;

    return (
        <div className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Speakers & Guests</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakers.map((speaker, index) => (
                    <div 
                        key={speaker.id || index} 
                        className="bento-card relative flex flex-col items-center p-6 bg-surface border border-border-subtle rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                        {/* Avatar */}
                        <div className="w-24 h-24 mb-4 rounded-full bg-surface-dark border-4 border-surface shadow-md overflow-hidden flex items-center justify-center relative z-10 group-hover:border-accent-primary transition-colors">
                            {speaker.avatar?.url ? (
                                <img src={speaker.avatar.url} alt={speaker.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-text-muted group-hover:text-accent-primary transition-colors">
                                    {(speaker.name || 'U').substring(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <h4 className="text-lg font-bold text-text-primary text-center mb-1 group-hover:text-accent-primary transition-colors">
                            {speaker.name}
                        </h4>
                        <p className="text-xs font-medium text-text-muted text-center uppercase tracking-wider mb-4 h-8 flex items-center">
                            {speaker.title || 'Guest Speaker'}
                        </p>

                        {/* LinkedIn Link */}
                        {speaker.linkedin && (
                            <a 
                                href={speaker.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="absolute bottom-4 flex items-center justify-center p-2 rounded-full bg-surface-light border border-border-subtle text-text-muted hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-blue-50 transition-all shadow-sm"
                                title="View LinkedIn Profile"
                            >
                                <LinkIcon size={16} />
                            </a>
                        )}
                        
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-surface-light to-transparent rounded-t-3xl opacity-50 pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
};
