import React, { useEffect, useState } from 'react';
import { TagSelector } from '../components/TagSelector';
import { ProblemRow } from '../components/ProblemRow';
import { CourseCard } from '../../course/components/CourseCard';
import { useFetchProblems } from '@domain/useCase/useFetchProblems';
import { useFetchRecommendedCourses } from '@domain/useCase/useFetchRecommendedCourses';
import { Code2, Sparkles, Filter, List, Loader2, AlertCircle } from 'lucide-react';

/**
 * ProblemPage: Coding challenges hub.
 * Orchestrates Search, Tags, Recommendations, and Challenge Table.
 * Data flows through: useFetchProblems → CardProblemEntity[] and useFetchRecommendedCourses → CardCourseEntity[]
 */
export const ProblemPage = () => {
    const [selectedTags, setSelectedTags] = useState([]);

    // Real data hooks
    const { fetchProblems, problems, loading: problemsLoading, error: problemsError } = useFetchProblems();
    const { fetchCourses, courses, loading: coursesLoading, error: coursesError } = useFetchRecommendedCourses();

    // Fetch on mount
    useEffect(() => {
        fetchProblems();
        fetchCourses(4);
    }, []);

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Derive display data
    const displayProblems = problems || [];
    const displayCourses = courses || [];

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1 text-accent-primary">
                    <Code2 size={24} />
                    <h1 className="text-3xl font-bold tracking-tight">Code Challenges</h1>
                </div>
                <p className="text-sm text-text-muted max-w-2xl">
                    Sharpen your logic and solve industry-level problems. Each challenge is designed to push your boundaries.
                </p>
            </div>

            {/* Recommendations Row */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-primary">
                    <Sparkles size={18} />
                    <h2 className="font-bold tracking-wide uppercase text-[10px]">Prepare First</h2>
                </div>

                {coursesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-accent-primary" />
                    </div>
                ) : coursesError ? (
                    <div className="flex items-center gap-2 p-4 text-sm text-red-400 bg-red-500/10 rounded-sm border border-red-500/20">
                        <AlertCircle size={16} />
                        <span>Failed to load recommendations</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayCourses.map((course, idx) => (
                            <CourseCard key={course.uid || idx} course={course} />
                        ))}
                        <div className="hidden lg:flex bento-card border-dashed border-white/10 items-center justify-center p-6 text-center group cursor-pointer hover:border-accent-primary/50 transition-colors">
                            <div className="flex flex-col items-center gap-2">
                                <Filter size={24} className="text-text-muted group-hover:text-accent-primary transition-colors" />
                                <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary uppercase tracking-widest">Find More Tracks</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Problems Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-text-primary">
                        <List size={18} className="text-accent-primary" />
                        <h2 className="font-bold tracking-wide uppercase text-xs">All Challenges</h2>
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                        {problemsLoading ? 'Loading...' : `Showing ${displayProblems.length} Problems`}
                    </div>
                </div>

                {/* Search Box & Tags positioned right above the table */}
                <div className="max-w-2xl">
                    <TagSelector 
                        selectedTags={selectedTags} 
                        onTagSelect={toggleTag} 
                    />
                </div>

                <div className="bento-card overflow-hidden">
                    <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        <div className="flex-1">Challenge Name</div>
                        <div className="flex items-center gap-8 pr-14">
                            <span>Difficulty</span>
                            <span>Action</span>
                        </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {problemsLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 size={24} className="animate-spin text-accent-primary" />
                            </div>
                        ) : problemsError ? (
                            <div className="flex items-center justify-center gap-2 py-16 text-sm text-red-400">
                                <AlertCircle size={16} />
                                <span>Failed to load problems</span>
                            </div>
                        ) : displayProblems.length === 0 ? (
                            <div className="flex items-center justify-center py-16 text-sm text-text-muted">
                                No challenges available yet.
                            </div>
                        ) : (
                            displayProblems.map((problem, idx) => (
                                <ProblemRow key={problem.documentId || idx} problem={problem} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
