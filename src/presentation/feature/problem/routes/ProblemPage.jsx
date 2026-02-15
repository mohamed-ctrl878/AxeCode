import React, { useMemo, useState } from 'react';
import { TagSelector } from '../components/TagSelector';
import { ProblemRow } from '../components/ProblemRow';
import { CourseCard } from '../../course/components/CourseCard';
import { CardCourseEntity } from '@domain/entity/CourseEntity';
import { CardProblemEntity } from '@domain/entity/ProblemEntity';
import { Code2, Sparkles, Filter, List } from 'lucide-react';

/**
 * ProblemPage: Coding challenges hub.
 * Orchestrates Search, Tags, Recommendations, and Challenge Table.
 */
export const ProblemPage = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    
    // Mock Courses for Recommendations
    const mockRecommendedCourses = useMemo(() => [
        new CardCourseEntity({
            title: "Data Structures & Algorithms Mastery",
            thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80",
            difficulty: "Intermediate",
            price: 49,
            studentCount: 5200,
            instructor: "DSA Specialist",
            weeks: [{ lessons: [1,2,3,4,5,6] }]
        }),
        new CardCourseEntity({
            title: "Competitive Programming Bootcamp",
            thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
            difficulty: "Advanced",
            price: 79,
            studentCount: 1800,
            instructor: "IOI Gold Medalist",
            weeks: [{ lessons: [1,2,3] }, { lessons: [4,5,6] }]
        })
    ], []);

    // Mock Problems using CardProblemEntity
    const mockProblems = useMemo(() => [
        new CardProblemEntity({ title: "Solve Binary Tree Symmetry", difficulty: "Easy", status: "Solved" }),
        new CardProblemEntity({ title: "Optimized Matrix Multiplier", difficulty: "Medium", status: "Attempted" }),
        new CardProblemEntity({ title: "Trapping Rain Water Challenge", difficulty: "Hard", status: "New" }),
        new CardProblemEntity({ title: "LRU Cache Implementation", difficulty: "Medium", status: "Solved" }),
        new CardProblemEntity({ title: "Longest Valid Parentheses", difficulty: "Hard", status: "New" })
    ], []);

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockRecommendedCourses.map((course, idx) => (
                        <CourseCard key={idx} course={course} />
                    ))}
                    <div className="hidden lg:flex bento-card border-dashed border-white/10 items-center justify-center p-6 text-center group cursor-pointer hover:border-accent-primary/50 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                            <Filter size={24} className="text-text-muted group-hover:text-accent-primary transition-colors" />
                            <span className="text-[10px] font-bold text-text-muted group-hover:text-text-primary uppercase tracking-widest">Find More Tracks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problems Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-text-primary">
                        <List size={18} className="text-accent-primary" />
                        <h2 className="font-bold tracking-wide uppercase text-xs">All Challenges</h2>
                    </div>
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                        Showing {mockProblems.length} Problems
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
                        {mockProblems.map((problem, idx) => (
                            <ProblemRow key={idx} problem={problem} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
