import React from 'react';
import { PlayCircle, ArrowRight, ShoppingCart, BookOpen, Clock, Users } from 'lucide-react';

/**
 * CourseActionSidebar: Sticky sidebar for pricing and CTAs.
 */
export const CourseActionSidebar = ({ course }) => {
    const totalLessons = course.weeks?.reduce((acc, w) => acc + (w.lessons?.length || 0), 0) || 0;

    return (
        <div className="lg:sticky lg:top-28 h-fit">
            <div className="p-8 bg-card border border-border-subtle rounded-[2rem] flex flex-col gap-6 shadow-2xl shadow-black/40">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Course Investment</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{course.price ? `$${course.price}` : 'FREE'}</span>
                        {course.price > 0 && <span className="text-sm font-mono text-text-muted line-through">$249</span>}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {course.hasAccess ? (
                        <button className="w-full h-14 rounded-2xl btn-primary">
                            <PlayCircle size={20} />
                            <span>Continue Learning</span>
                        </button>
                    ) : (
                        <button className="w-full h-14 rounded-2xl btn-primary">
                            {course.price === 0 ? <ArrowRight size={20} /> : <ShoppingCart size={20} />}
                            <span>{course.price === 0 ? 'Join For Free' : 'Secure Admission'}</span>
                        </button>
                    )}
                    
                    <p className="text-[10px] text-center text-text-muted font-mono uppercase tracking-widest leading-relaxed">
                        Join {course.studentCount}+ software architects in this journey
                    </p>
                </div>

                <div className="pt-6 border-t border-border-subtle flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><BookOpen size={14} /> Total Lessons</span>
                        <span className="font-mono text-text-primary">{totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><Clock size={14} /> Duration</span>
                        <span className="font-mono text-text-primary">12h 45m</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-2"><Users size={14} /> Access</span>
                        <span className="font-mono text-text-primary">Lifetime</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
