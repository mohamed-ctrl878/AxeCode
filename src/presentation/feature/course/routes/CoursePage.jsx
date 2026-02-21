import React, { useEffect } from 'react';
import { CourseCard } from '../components/CourseCard';
import { EventRecommendedCard } from '../components/EventRecommendedCard';
import { useFetchRecommendedCourses } from '@domain/useCase/useFetchRecommendedCourses';
import { useFetchRecommendedEvents } from '@domain/useCase/useFetchRecommendedEvents';
import { Search, ChevronRight, Sparkles, Map, BookOpen, Loader2, AlertTriangle } from 'lucide-react';


/**
 * CoursePage: Dashboard for learning content.
 * Follows a modular architecture by orchestrating smaller domain components.
 */
export const CoursePage = () => {
    const { fetchCourses, courses, loading: coursesLoading, error: coursesError } = useFetchRecommendedCourses();
    const { fetchEvents, events, loading: eventsLoading, error: eventsError } = useFetchRecommendedEvents();

    useEffect(() => {
        fetchCourses();
        fetchEvents();
    }, []);

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Knowledge Hub</h1>
                    <p className="text-xs text-text-muted">Master the art of coding with guided learning paths.</p>
                </div>
                
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="bg-surface-sunken border border-border-subtle rounded-full py-2 pl-9 pr-4 text-xs focus:border-accent-blue outline-none transition-colors duration-200 w-full md:w-48"
                        />
                    </div>
                </div>
            </div>

            {/* Top Row: Events (Left) + Roadmap (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-0 items-stretch border border-border-subtle rounded-sm overflow-hidden bg-surface">
                {/* Recommended Events Section */}
                <div className="lg:col-span-9 p-4 lg:p-6 lg:border-r border-border-subtle">
                    <div className="flex items-center gap-2 mb-4 text-accent-blue">
                        <Sparkles size={16} />
                        <h2 className="font-bold tracking-wide uppercase text-[10px]">Featured Opportunities</h2>
                    </div>

                    {eventsLoading ? (
                        <div className="flex items-center justify-center py-8 gap-2 text-text-muted">
                            <Loader2 size={16} className="animate-spin text-accent-blue" />
                            <span className="text-xs font-mono">Loading events...</span>
                        </div>
                    ) : eventsError ? (
                        <div className="flex items-center justify-center py-8 gap-2 text-accent-rose">
                            <AlertTriangle size={16} />
                            <span className="text-xs font-mono">Failed to load events</span>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide items-stretch">
                            {events?.map((event, idx) => (
                                <div key={event.uid || idx} className="min-w-[280px]">
                                    <EventRecommendedCard event={event} />
                                </div>
                            ))}
                            <button className="min-w-[100px] flex flex-col items-center justify-center gap-2 bg-surface-sunken rounded-sm hover:bg-surface-elevated transition-colors duration-200 text-text-muted hover:text-accent-blue">
                                <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                                    <ChevronRight size={16} />
                                </div>
                                <span className="text-[10px] font-bold uppercase">View All</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Roadmap Section */}
                <div className="lg:col-span-3 p-4 lg:p-6 bg-gradient-to-br from-accent-violet/8 to-transparent flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 text-accent-violet">
                        <Map size={16} />
                        <h2 className="font-bold tracking-wide uppercase text-[10px]">Your Roadmap</h2>
                    </div>
                    <div>
                        <h3 className="font-bold text-[11px] mb-1">AI Path-finding</h3>
                        <p className="text-[9px] text-text-muted mb-4 leading-relaxed">
                            Generate your specialized learning path now.
                        </p>
                        <button className="w-full py-2.5 btn-primary rounded-lg text-[10px] font-bold">
                            GENERATE ROADMAP
                        </button>
                    </div>
                </div>
            </div>


            {/* Main Courses Grid - Full Width */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-muted">
                    <BookOpen size={16} className="text-accent-blue" />
                    <h2 className="font-bold tracking-wide uppercase text-[10px]">Active Courses</h2>
                </div>

                {coursesLoading ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-text-muted">
                        <Loader2 size={20} className="animate-spin text-accent-blue" />
                        <span className="text-sm font-mono">Loading courses...</span>
                    </div>
                ) : coursesError ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-accent-rose">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-mono">Failed to load courses</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {courses?.map((course, idx) => (
                            <CourseCard key={course.uid || idx} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



export default CoursePage;
