import React from 'react';
import { Trophy, BookOpen, Calendar, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../../../routes/paths';

const COLOR_CLASSES = {
    'accent-primary': {
        bg: 'bg-accent-primary/10',
        text: 'text-accent-primary',
        hover: 'group-hover:bg-accent-primary',
        bar: 'bg-accent-primary'
    },
    'accent-violet': {
        bg: 'bg-accent-violet/10',
        text: 'text-accent-violet',
        hover: 'group-hover:bg-accent-violet',
        bar: 'bg-accent-violet'
    }
};

const TopContentWidget = ({ events = [], courses = [] }) => {
    // Take the first few items as "Top Performers"
    const topPerformers = [
        ...courses.slice(0, 2).map(c => ({ ...c, type: 'course', icon: BookOpen, color: 'accent-primary', label: 'Top Course' })),
        ...events.slice(0, 1).map(e => ({ ...e, type: 'event', icon: Calendar, color: 'accent-violet', label: 'Trending' }))
    ].sort((a, b) => b.id - a.id); // Simple sort for display

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-near-black flex items-center gap-2">
                    <Trophy size={14} className="text-accent-primary" />
                    High-Velocity Modules
                </h3>
                <span className="text-[10px] text-success font-bold uppercase tracking-widest bg-success/10 px-2 py-0.5 rounded">Real-Time Sync</span>
            </div>

            <div className="space-y-4">
                {topPerformers.length > 0 ? topPerformers.map((item, index) => {
                    const colors = COLOR_CLASSES[item.color] || COLOR_CLASSES['accent-primary'];
                    return (
                        <div key={`${item.type}-${item.id}`} className="bg-surface-sunken/40 border border-border-subtle p-4 rounded-2xl hover:bg-surface-sunken transition-all group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 ${colors.bg} ${colors.text} rounded-lg ${colors.hover} group-hover:text-ivory transition-colors`}>
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-near-black uppercase tracking-tight line-clamp-1">{item.title || item.name || 'Untitled Module'}</p>
                                        <p className="text-[9px] text-text-muted font-medium mt-0.5">{item.label} • REF-{item.id}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-[10px] font-bold ${colors.text}`}>{index === 0 ? '98.4%' : 'Hot'}</span>
                                    <div className="w-12 h-1 bg-border-subtle rounded-full mt-1 overflow-hidden">
                                        <div className={`h-full ${colors.bar} ${index === 0 ? 'w-[98%]' : 'w-[100%] animate-pulse'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-12 text-center border border-dashed border-border-subtle rounded-3xl">
                        <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-text-muted">No high-velocity data detected</p>
                    </div>
                )}
            </div>

            <Link 
                to={PATHS.CONTENT_MANAGEMENT} 
                className="block w-full text-center py-2.5 text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-near-black transition-colors border border-dashed border-border-subtle rounded-xl"
            >
                View Analytics Archive
            </Link>
        </div>
    );
};

export default TopContentWidget;
