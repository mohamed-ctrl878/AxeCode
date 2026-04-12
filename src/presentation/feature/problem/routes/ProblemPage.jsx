import React, { useEffect, useState } from 'react';
import { TagSelector } from '../components/TagSelector';
import { ProblemRow } from '../components/ProblemRow';
import { CourseCard } from '../../course/components/CourseCard';
import { useFetchProblems } from '@domain/useCase/useFetchProblems';
import { useFetchRecommendedCourses } from '@domain/useCase/useFetchRecommendedCourses';
import { useSearchProblems } from '@domain/useCase/useSearchProblems';
import { Code2, Sparkles, Filter, List, Loader2, AlertCircle, Search } from 'lucide-react';
import { CourseCardSkeleton } from '@presentation/shared/components/skeletons/CourseCardSkeleton';
import { ProblemRowSkeleton } from '@presentation/shared/components/skeletons/ProblemRowSkeleton';

/**
 * ProblemPage: Coding challenges hub.
 */
export const ProblemPage = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    
    // Search Integration
    const [searchQuery, setSearchQuery] = useState('');
    const { searchProblems, problems: searchResults, loading: searchLoading, error: searchError } = useSearchProblems();

    // Real data hooks
    const { fetchProblems, problems: defaultProblems, loading: problemsLoading, error: problemsError } = useFetchProblems();
    const { fetchCourses, courses, loading: coursesLoading, error: coursesError } = useFetchRecommendedCourses();

    // Fetch on mount
    useEffect(() => {
        fetchProblems();
        fetchCourses(4);
    }, []);

    // Debounced Search Logic
    useEffect(() => {
        if (searchQuery.trim().length === 0) return;
        
        const timeoutId = setTimeout(() => {
            searchProblems(searchQuery);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Derive display data
    const isSearching = searchQuery.trim().length > 1;
    const displayProblems = (isSearching ? searchResults : defaultProblems) || [];
    const isLoadingProblems = isSearching ? searchLoading : problemsLoading;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <CourseCardSkeleton key={i} />)}
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
                        <div className="hidden lg:flex bento-card border-dashed border-border-subtle items-center justify-center p-6 text-center group cursor-pointer hover:border-accent-primary/50 transition-colors">
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
                        <h2 className="font-bold tracking-wide uppercase text-xs">
                            {isSearching ? `Search Results for "${searchQuery}"` : 'All Challenges'}
                        </h2>
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                        {isLoadingProblems ? 'Processing...' : `Showing ${displayProblems.length} Problems`}
                    </div>
                </div>

                {/* Search Box & Tags positioned right above the table */}
                <div className="max-w-2xl flex flex-col gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search challenges by name..." 
                            className="w-full bg-surface-sunken border border-border-subtle rounded-xl py-2.5 pl-10 pr-10 text-sm focus:border-accent-primary outline-none transition-all"
                        />
                        {isSearching && searchLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 size={16} className="animate-spin text-accent-primary" />
                            </div>
                        )}
                    </div>

                    <TagSelector 
                        selectedTags={selectedTags} 
                        onTagSelect={toggleTag} 
                    />
                </div>

                <div className="bento-card overflow-hidden">
                    <div className="bg-surface-elevated px-6 py-3 border-b border-border-subtle flex items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        <div className="flex-1">Challenge Name</div>
                        <div className="flex items-center gap-8 pr-14">
                            <span>Difficulty</span>
                            <span>Action</span>
                        </div>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {isLoadingProblems ? (
                            <div className="flex flex-col gap-1">
                                {[1, 2, 3, 4, 5].map(i => <ProblemRowSkeleton key={i} />)}
                            </div>
                        ) : problemsError || searchError ? (
                            <div className="flex items-center justify-center gap-2 py-16 text-sm text-red-400">
                                <AlertCircle size={16} />
                                <span>Failed to load problems</span>
                            </div>
                        ) : displayProblems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                                <Search size={32} className="opacity-20 mb-3" />
                                <p className="text-sm">No matches found for your search.</p>
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
