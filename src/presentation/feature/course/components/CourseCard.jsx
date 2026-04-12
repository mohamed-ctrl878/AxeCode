import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, UserCircle, Star, ArrowRight, ShoppingCart, PlayCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '@presentation/routes/paths';

/**
 * CourseCard: Visual representation of CardCourseEntity.
 * Uses elevated surface with subtle hover transitions.
 */
export const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { 
        uid,
        title, 
        thumbnail, 
        difficulty, 
        price, 
        studentCount, 
        hasAccess, 
        instructor,
        weeks,
        rating
    } = course;

    const lessonCount = weeks?.reduce((acc, w) => acc + (w.lessons?.length || 0), 0) || 0;

    const handleDetails = () => {
        navigate(`${PATHS.COURSES}/${uid}`);
    };

    return (
        <div 
            onClick={handleDetails}
            className="group flex flex-col overflow-hidden h-fit bg-surface-elevated border border-border-subtle rounded-xl transition-all duration-200 hover:border-border-default hover:shadow-[0_0_0_1px_var(--border-default),0_4px_24px_rgba(0,0,0,0.05)] cursor-pointer"
        >
            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden h-32">
                <img 
                    src={thumbnail?.url || 'https://via.placeholder.com/400x225'} 
                    alt={title || 'Course'}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />

                <div className="absolute top-2 left-2 flex gap-1.5">
                    {difficulty && (
                        <span className={cn(
                            "px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded-full backdrop-blur-md border",
                            difficulty === 'Advanced' ? "bg-accent-rose/15 text-accent-rose border-accent-rose/20" : 
                            difficulty === 'Intermediate' ? "bg-accent-amber/15 text-accent-amber border-accent-amber/20" : 
                            "bg-accent-emerald/15 text-accent-emerald border-accent-emerald/20"
                        )}>
                            {difficulty}
                        </span>
                    )}
                </div>
                
                {/* Rating Badge */}
                <div className="absolute bottom-2 right-2 bg-surface-sunken/80 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1.5 border border-border-subtle/50">
                    <Star size={10} className="text-accent-amber fill-accent-amber" />
                    <span className="text-[10px] font-medium text-text-primary">{rating || 4.8}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                    <h3 className="text-sm line-clamp-1 text-text-primary group-hover:text-accent-primary transition-colors duration-200 mb-1">
                        {title || 'Untitled Course'}
                    </h3>

                    <div className="flex items-center gap-2 text-text-muted text-[10px]">
                        <UserCircle size={12} className="text-text-muted" />
                        <span>{instructor || 'Ax Architect'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono uppercase tracking-tight">
                    <span className="flex items-center gap-1">
                        <BookOpen size={12} className="text-accent-primary" /> {lessonCount} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={12} className="text-text-muted" /> {studentCount}+
                    </span>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className={cn(
                        "text-sm font-medium",
                        price == null || price === 0 
                            ? "text-accent-emerald" 
                            : "text-text-primary"
                    )}>
                        {price == null || price === 0 ? "Free" : `$${price}`}
                    </span>
                    
                    <div className="flex gap-2">
                        {/* Primary Action Button */}
                         {hasAccess ? (
                              <button 
                                onClick={() => {
                                    // Extract first lesson from weeks Map structure
                                    const allLessons = weeks?.flatMap(w => 
                                        w.lessons instanceof Map ? Array.from(w.lessons.values()) : (w.lessons || [])
                                    ) || [];
                                    const firstLesson = allLessons.find(l => l);
                                    const firstLessonId = firstLesson?.uid || firstLesson?.documentId || firstLesson?.id;
                                    
                                    if (firstLessonId) {
                                        navigate(`/courses/${uid}/learn/lesson/${firstLessonId}`);
                                    } else {
                                        navigate(`${PATHS.COURSES}/${uid}`);
                                    }
                                }}
                                className="px-4 py-1.5 rounded-lg btn-primary"
                              >
                                 <PlayCircle size={12} />
                                 <span>Continue</span>
                              </button>
                         ) : (
                            !price ? (
                                <button className="px-4 py-1.5 rounded-lg btn-success">
                                    <ArrowRight size={12} />
                                    <span>Free Join</span>
                                </button>
                            ) : (
                                <button className="px-4 py-1.5 rounded-lg btn-primary">
                                    <ShoppingCart size={12} />
                                    <span>Buy Now</span>
                                </button>
                            )
                        )}

                        <button 
                            onClick={handleDetails}
                            className="px-4 py-1.5 rounded-lg btn-secondary text-[10px]"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
