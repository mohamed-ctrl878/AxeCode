import React, { useMemo } from 'react';
import { CourseCard } from '../components/CourseCard';
import { EventRecommendedCard } from '../components/EventRecommendedCard';
import { CardCourseEntity } from '@domain/entity/CourseEntity';
import { CardEventEntity } from '@domain/entity/EventEntity';
import { Search, ChevronRight, Sparkles, Map, BookOpen } from 'lucide-react';


/**
 * CoursePage: Dashboard for learning content.
 * Follows a modular architecture by orchestrating smaller domain components.
 */
export const CoursePage = () => {
    // Mock Data using Domain Entities
    const mockCourses = useMemo(() => [
        new CardCourseEntity({
            title: "Advanced Clean Architecture in React",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
            difficulty: "Advanced",
            price: 99,
            studentCount: 1240,
            hasAccess: true,
            instructor: "Mohamed El-Hussainy",
            weeks: [{ lessons: [1, 2, 3] }, { lessons: [4, 5] }]
        }),
        new CardCourseEntity({
            title: "Futuristic UI Patterns with Tailwind v4",
            thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
            difficulty: "Intermediate",
            price: 0,
            studentCount: 3500,
            hasAccess: false,
            instructor: "Axe Code Core Team",
            weeks: [{ lessons: [1, 2, 3, 4] }]
        }),
        new CardCourseEntity({
            title: "High Performance JavaScript Engines",
            thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80",
            difficulty: "Advanced",
            price: 149,
            studentCount: 890,
            hasAccess: false,
            instructor: "JetBrains Expert",
            weeks: [{ lessons: [1, 2] }, { lessons: [3, 4] }, { lessons: [5] }]
        })
    ], []);

    const mockEvents = useMemo(() => [
        new CardEventEntity({
            title: "React 19 Deep Dive Workshop",
            type: "Workshop",
            startDate: new Date('2026-03-20'),
            endDate: new Date('2026-03-21'),
            location: "Virtual",
            cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
            price: 0,
            registeredCount: 450
        }),
        new CardEventEntity({
            title: "Tech Networking: Zero Gravity",
            type: "Meetup",
            startDate: new Date('2026-04-10'),
            endDate: new Date('2026-04-10'),
            location: "Cairo Tech Hub",
            cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80",
            price: 25,
            registeredCount: 120
        })
    ], []);

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
                            className="bg-surface-dark/50 border border-border-subtle rounded-full py-2 pl-9 pr-4 text-xs focus:border-accent-primary outline-none transition-colors w-full md:w-48"
                        />
                    </div>
                </div>
            </div>

            {/* Top Row: Events (Left) + Roadmap (Right) - Zero Gap on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-0 items-stretch border border-white/5 rounded-3xl overflow-hidden glass">
                {/* Recommended Events Section */}
                <div className="lg:col-span-9 p-4 lg:p-6 lg:border-r border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-accent-primary">
                        <Sparkles size={16} />
                        <h2 className="font-bold tracking-wide uppercase text-[10px]">Featured Opportunities</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide items-stretch">
                        {mockEvents.map((event, idx) => (
                            <div key={idx} className="min-w-[280px]">
                                <EventRecommendedCard event={event} />
                            </div>
                        ))}
                        <button className="min-w-[100px] flex flex-col items-center justify-center gap-2 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-text-muted hover:text-accent-primary">
                            <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center">
                                <ChevronRight size={16} />
                            </div>
                            <span className="text-[10px] font-bold uppercase">View All</span>
                        </button>
                    </div>
                </div>

                {/* AI Roadmap Section - Merged into the same glass container */}
                <div className="lg:col-span-3 p-4 lg:p-6 bg-gradient-to-br from-accent-primary/5 to-transparent flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3 text-accent-primary">
                        <Map size={16} />
                        <h2 className="font-bold tracking-wide uppercase text-[10px]">Your Roadmap</h2>
                    </div>
                    <div>
                        <h3 className="font-bold text-[11px] mb-1">AI Path-finding</h3>
                        <p className="text-[9px] text-text-muted mb-4 leading-relaxed">
                            Generate your specialized learning path now.
                        </p>
                        <button className="w-full py-2 btn-primary rounded-lg text-[9px] font-bold">
                            GENERATE
                        </button>
                    </div>
                </div>
            </div>


            {/* Main Courses Grid - Full Width */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-muted">
                    <BookOpen size={16} className="text-accent-primary" />
                    <h2 className="font-bold tracking-wide uppercase text-[10px]">Active Courses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {mockCourses.map((course, idx) => (
                        <CourseCard key={idx} course={course} />
                    ))}
                    {/* Repeat mock for visual grid testing if needed */}
                    {mockCourses.map((course, idx) => (
                        <CourseCard key={`extra-${idx}`} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};



export default CoursePage;
