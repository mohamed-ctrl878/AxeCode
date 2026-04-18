import React from 'react';
import { Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@presentation/routes/paths';

/**
 * CourseHero: Visual header for the course details page.
 */
export const CourseHero = ({ course }) => {
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col gap-6">
            {/* Visual Hero */}
            <div className="relative group">
                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border-subtle bg-surface-sunken shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                     <img 
                        src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80'} 
                        alt={course.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                     />
                     {/* <div className="absolute inset-0 flex items-center justify-center">
                        <button className="w-20 h-20 rounded-full btn-primary">
                            <Play size={32} fill="currentColor" />
                        </button>
                     </div> */}
                </div>
            </div>

            {/* Title & Meta Info */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-[10px] font-mono uppercase border border-accent-primary/20">
                        {course.difficulty}
                    </span>
                    {course.rating > 0 && (
                        <div className="flex items-center gap-1.5 text-accent-amber">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-medium text-text-primary">{course.rating.toFixed(1)}</span>
                            <span className="text-xs text-text-muted font-mono">({course.reviewsCount} reviews)</span>
                        </div>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-text-primary leading-[1.10]">
                    {course.title}
                </h1>
                <div 
                    className="flex items-center gap-4 py-2 cursor-pointer w-fit group hover:opacity-80 transition-opacity"
                    onClick={() => {
                        if (course.instructor?.username) {
                            navigate(PATHS.PROFILE.replace(':username', course.instructor.username));
                        }
                    }}
                >
                    <div className="w-10 h-10 rounded-full border border-border-subtle overflow-hidden relative">
                        <img src={course.instructor?.avatarUrl || `https://ui-avatars.com/api/?name=${course.instructor?.username}&background=000&color=fff`} alt="Instructor" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Instructor</span>
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">{course.instructor?.displayName || 'Axe University'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
