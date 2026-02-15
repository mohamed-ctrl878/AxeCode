import React from 'react';
import { Users, BookOpen, Layers } from 'lucide-react';
import { cn } from '@core/utils/cn';

/**
 * CourseCard: Visual representation of CardCourseEntity.
 * Uses Bento-style architecture with glassmorphism hover effects.
 */
export const CourseCard = ({ course }) => {
    const { 
        title, 
        thumbnail, 
        difficulty, 
        price, 
        studentCount, 
        hasAccess, 
        instructor,
        weeks 
    } = course;

    const lessonCount = weeks.reduce((acc, w) => acc + (w.lessons?.length || 0), 0);

    return (
        <div className="bento-card group flex flex-col overflow-hidden h-fit">
            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden h-32">
                <img 
                    src={thumbnail || 'https://via.placeholder.com/400x225'} 
                    alt={title}
                    className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className={cn(
                        "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md border border-white/10",
                        difficulty === 'Advanced' ? "bg-red-500/20 text-red-500" : 
                        difficulty === 'Intermediate' ? "bg-amber-500/20 text-amber-500" : 
                        "bg-accent-primary/20 text-accent-primary"
                    )}>
                        {difficulty}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-sm line-clamp-1 text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                    {title}
                </h3>

                <div className="flex items-center gap-2 mb-3 text-text-muted text-[10px]">
                    <span className="flex items-center gap-1">
                        <UserCircle size={12} /> {instructor}
                    </span>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1 text-text-muted text-[10px]">
                            <BookOpen size={12} className="text-accent-primary" />
                            <span>{lessonCount} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-muted text-[10px]">
                            <Users size={12} className="text-accent-primary" />
                            <span>{studentCount}+</span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                        {price === 0 ? "Free" : `$${price}`}
                    </span>
                </div>
            </div>
        </div>
    );
};


// Internal icon import fix for consistency
import { UserCircle } from 'lucide-react';
