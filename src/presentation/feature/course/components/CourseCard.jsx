import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, UserCircle, Star, ArrowRight, ShoppingCart, PlayCircle } from 'lucide-react';
import { cn } from '@core/utils/cn';
import { PATHS } from '@presentation/routes/paths';

/**
 * CourseCard: Visual representation of CardCourseEntity.
 * Uses Bento-style architecture with glassmorphism hover effects.
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
        <div className="bento-card group flex flex-col overflow-hidden h-fit bg-card border border-border-subtle rounded-3xl transition-all duration-500 hover:border-accent-primary/40">
            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden h-32">
                <img 
                    src={thumbnail?.url || 'https://via.placeholder.com/400x225'} 
                    alt={title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
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
                
                {/* Rating Badge */}
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-md rounded-lg px-2 py-1 border border-border-subtle flex items-center gap-1.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-text-primary">{rating || 4.8}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                    <h3 className="font-bold text-sm line-clamp-1 text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 text-text-muted text-[10px]">
                        <UserCircle size={12} className="text-text-muted" />
                        <span>{instructor?.username || 'Ax Architect'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono uppercase tracking-tight">
                    <span className="flex items-center gap-1">
                        <BookOpen size={12} className="text-accent-primary" /> {lessonCount} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={12} className="text-accent-primary" /> {studentCount}+
                    </span>
                </div>

                {/* Course Metadata (Price & Rating Row) */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-sm font-bold text-text-primary">
                        {price === 0 ? "Free" : `$${price}`}
                    </span>
                    
                    <div className="flex gap-2">
                        {/* Primary Action Button */}
                        {hasAccess ? (
                             <button className="px-4 py-1.5 rounded-full btn-primary">
                                <PlayCircle size={12} />
                                <span>Continue</span>
                             </button>
                        ) : (
                            price === 0 ? (
                                <button className="px-4 py-1.5 rounded-full btn-primary">
                                    <ArrowRight size={12} />
                                    <span>Free Join</span>
                                </button>
                            ) : (
                                <button className="px-4 py-1.5 rounded-full btn-primary">
                                    <ShoppingCart size={12} />
                                    <span>Buy Now</span>
                                </button>
                            )
                        )}

                        <button 
                            onClick={handleDetails}
                            className="bg-surface border border-border-subtle text-text-primary px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-border-subtle transition-colors"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
