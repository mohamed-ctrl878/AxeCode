import React from 'react';
import { Star, Play } from 'lucide-react';

/**
 * CourseHero: Visual header for the course details page.
 */
export const CourseHero = ({ course }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Visual Hero */}
            <div className="relative group">
                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border-subtle bg-surface-dark shadow-2xl">
                     <img 
                        src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80'} 
                        alt={course.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-20 h-20 rounded-full btn-primary">
                            <Play size={32} fill="currentColor" />
                        </button>
                     </div>
                </div>
            </div>

            {/* Title & Meta Info */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-[10px] font-mono uppercase border border-accent-primary/20">
                        {course.difficulty}
                    </span>
                    <div className="flex items-center gap-1.5 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold text-text-primary">{course.rating}</span>
                        <span className="text-xs text-text-muted font-mono">(1.2k reviews)</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]">
                    {course.title}
                </h1>
                <div className="flex items-center gap-4 py-2">
                    <div className="w-10 h-10 rounded-full border border-border-subtle overflow-hidden">
                        <img src={course.instructor?.avatarUrl || `https://ui-avatars.com/api/?name=${course.instructor?.username}&background=000&color=fff`} alt="Instructor" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Instructor</span>
                        <span className="text-sm font-bold text-text-primary">{course.instructor?.displayName || 'Axe Architect'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
