import React from 'react';
import { BookOpen, Calendar, Award } from 'lucide-react';

const ContributorStatsViewer = ({ stats = {} }) => {
    return (
        <div className="animation-slide-up">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-sm font-serif font-bold text-near-black uppercase tracking-widest flex items-center gap-2">
                        <Award size={16} className="text-accent-primary" />
                        Scholarly Contributors
                    </h2>
                    <p className="text-[10px] text-text-muted mt-1 uppercase tracking-tighter">Verified authors and organizers across the academy</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Course Contributors */}
                <div className="relative group">
                    <div className="p-8 bg-surface border border-border-subtle rounded-3xl group-hover:border-accent-primary transition-all duration-500 overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                           <BookOpen size={120} />
                        </div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 font-serif">Curriculum Authors</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-near-black font-sans">{stats.courseAuthors || 0}</span>
                            <span className="text-xs text-text-muted font-medium italic">Unique Educators</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border-subtle">
                             <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                 <span className="text-text-muted">Status</span>
                                 <span className="text-success">Active Pipeline</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Event Organizers */}
                <div className="relative group">
                    <div className="p-8 bg-surface border border-border-subtle rounded-3xl group-hover:border-tertiary transition-all duration-500 overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                           <Calendar size={120} />
                        </div>
                        <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 font-serif">Assembly Organizers</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-near-black font-sans">{stats.eventOrganizers || 0}</span>
                            <span className="text-xs text-text-muted font-medium italic">Event Leads</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border-subtle">
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                <span className="text-text-muted">Status</span>
                                <span className="text-tertiary">Live Network</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributorStatsViewer;
