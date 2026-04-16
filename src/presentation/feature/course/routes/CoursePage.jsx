import React, { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { EventRecommendedCard } from '../components/EventRecommendedCard';
import { useFetchRecommendedCourses } from '@domain/useCase/useFetchRecommendedCourses';
import { useFetchRecommendedEvents } from '@domain/useCase/useFetchRecommendedEvents';
import { useSearchCourses } from '@domain/useCase/useSearchCourses';
import { Search, ChevronRight, Sparkles, Map, BookOpen, AlertTriangle, Tag, ChevronDown, Loader2 } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { CourseCardSkeleton } from '@presentation/shared/components/skeletons/CourseCardSkeleton';
import { EventRecommendedCardSkeleton } from '@presentation/shared/components/skeletons/EventRecommendedCardSkeleton';
import { PageLoader } from '@presentation/shared/components/loaders/PageLoader';

import { useNavigate } from 'react-router-dom';

/**
 * CoursePage: Dashboard for learning content.
 * Follows a modular architecture by orchestrating smaller domain components.
 */
export const CoursePage = () => {
    const navigate = useNavigate();
    const { fetchCourses, courses: recommendedCourses, loading: recommendedLoading, error: recommendedError } = useFetchRecommendedCourses();
    const { fetchEvents, events, loading: eventsLoading, error: eventsError } = useFetchRecommendedEvents();
    
    // Search Integration
    const [searchQuery, setSearchQuery] = useState('');
    const { searchCourses, courses: searchResults, loading: searchLoading, error: searchError } = useSearchCourses();
    
    const [showTags, setShowTags] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchEvents();
    }, []);

    // Debounced Search Logic
    useEffect(() => {
        if (searchQuery.trim().length === 0) return;
        
        const timeoutId = setTimeout(() => {
            searchCourses(searchQuery);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Derived State for UI
    const isSearching = searchQuery.trim().length > 1;
    const displayCourses = (isSearching ? searchResults : recommendedCourses) || [];
    const isLoadingCourses = isSearching ? searchLoading : recommendedLoading;
    const courseError = isSearching ? searchError : recommendedError;

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl tracking-tight">Knowledge Hub</h1>
                    <p className="text-xs text-text-muted">Master the art of coding with guided learning paths.</p>
                </div>
            </div>

            {/* Top Row: Events (Left) + Roadmap (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-0 items-stretch border border-border-subtle rounded-xl overflow-hidden bg-surface">
                {/* Recommended Events Section */}
                <div className="lg:col-span-9 p-4 lg:p-6 lg:border-r border-border-subtle">
                    <div className="flex items-center gap-2 mb-4 text-accent-primary">
                        <Sparkles size={16} />
                        <h2 className="tracking-wide uppercase text-[10px]">Featured Opportunities</h2>
                    </div>

                    {eventsLoading ? (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[280px]">
                                    <EventRecommendedCardSkeleton />
                                </div>
                            ))}
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
                            <button 
                                onClick={() => navigate(PATHS.EVENTS)}
                                className="min-w-[100px] flex flex-col items-center justify-center gap-2 bg-surface-sunken rounded-lg hover:bg-surface-elevated transition-colors duration-200 text-text-muted hover:text-accent-primary"
                            >
                                <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                                    <ChevronRight size={16} />
                                </div>
                                <span className="text-[10px] font-medium uppercase">View All</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Roadmap Section */}
                <div className="lg:col-span-3 p-4 lg:p-6 bg-accent-primary/5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 text-accent-primary">
                        <Map size={16} />
                        <h2 className="tracking-wide uppercase text-[10px]">Your Roadmap</h2>
                    </div>
                    <div>
                        <h3 className="font-medium text-[11px] mb-1">AI Path-finding</h3>
                        <p className="text-[9px] text-text-muted mb-4 leading-relaxed">
                            Generate your specialized learning path now.
                        </p>
                        <button 
                            onClick={() => navigate(PATHS.ROADMAPS)}
                            className="w-full py-2.5 btn-primary rounded-lg text-[10px] font-medium"
                        >
                            GENERATE ROADMAP
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Courses Grid - Full Width */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-text-muted">
                        <BookOpen size={16} className="text-accent-primary" />
                        <h2 className="tracking-wide uppercase text-[10px]">
                            {isSearching ? `Search Results for "${searchQuery}"` : 'Active Courses'}
                        </h2>
                    </div>
                
                    {/* Search & Tags Filter */}
                    <div className="flex flex-col gap-3 w-full max-w-2xl">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search among active courses..." 
                                    className="w-full bg-surface-sunken border border-border-subtle rounded-xl py-2.5 pl-10 pr-10 text-sm focus:border-accent-primary outline-none transition-all"
                                />
                                {isSearching && searchLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 size={16} className="animate-spin text-accent-primary" />
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setShowTags(!showTags)}
                                className={`px-4 py-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                                    showTags 
                                        ? 'border-accent-primary text-accent-primary bg-accent-primary/5' 
                                        : 'border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                                }`}
                            >
                                <Tag size={16} />
                                <span>Tags</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${showTags ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                            
                        {/* Expandable Tags Area */}
                        {showTags && (
                            <div className="bg-surface shadow-md p-4 rounded-2xl border border-border-subtle animation-slide-down">
                                <div className="flex flex-wrap gap-2">
                                    {['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI', 'UI/UX'].map(tag => (
                                        <button 
                                            key={tag} 
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-sunken border border-border-subtle text-text-muted hover:border-accent-primary/50 hover:text-text-primary transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isLoadingCourses ? (
                    <div className="py-12">
                        <PageLoader />
                    </div>
                ) : courseError ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-accent-rose">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-mono">Failed to load courses</span>
                    </div>
                ) : displayCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                        <Search size={40} className="opacity-20 mb-4" />
                        <p className="text-sm">No courses matching your search were found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {displayCourses.map((course, idx) => (
                            <CourseCard key={course.uid || idx} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};




export default CoursePage;
