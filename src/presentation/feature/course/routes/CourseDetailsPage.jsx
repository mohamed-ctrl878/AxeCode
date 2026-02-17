import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { CourseHero } from '../components/CourseHero';
import { CourseAbout } from '../components/CourseAbout';
import { CourseCurriculum } from '../components/CourseCurriculum';
import { CourseActionSidebar } from '../components/CourseActionSidebar';
import { CourseEntity } from '@domain/entity/CourseEntity';
import { UserEntity } from '@domain/entity/UserEntity';

/**
 * CourseDetailsPage: Assembly of course details components.
 * Follows SRP by delegating rendering to specialized sub-components.
 */
const CourseDetailsPage = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();

    // Mock data for initial presentation
    const course = new CourseEntity({
        id: 1,
        uid: documentId || 'demo-uid',
        title: "Advanced Agentic Coding with React & AI",
        description: [
            { type: 'paragraph', children: [{ text: "Master the art of building powerful AI-driven coding assistants and automated workflows using React 19 and the latest LLM orchestration patterns." }] },
            { type: 'heading', level: 3, children: [{ text: "What you will learn" }] },
            { type: 'paragraph', children: [{ text: "From clean architecture principles to real-time agentic tool-calling, this course covers everything needed to build production-ready developer tools." }] }
        ],
        difficulty: "Advanced",
        price: 99,
        studentCount: 1240,
        hasAccess: false,
        rating: 4.9,
        instructor: new UserEntity({ username: "Hussein.js", firstname: "Hussein", lastname: "Elhussein" }),
        weeks: [
            {
                id: 1,
                title: "Week 1: Fundamentals of AI Agents",
                lessons: [
                    { id: 101, title: "Introduction to Agentic UX", type: "video", isPublic: true },
                    { id: 102, title: "LLM Orchestration Patterns", type: "article", isPublic: false }
                ]
            },
            {
                id: 2,
                title: "Week 2: Advanced Tool Calling",
                lessons: [
                    { id: 201, title: "Implementing Dynamic Function Injection", type: "video", isPublic: false },
                    { id: 202, title: "Handling Concurrent Tool Executions", type: "video", isPublic: false }
                ]
            }
        ]
    });

    return (
        <div className="md:col-span-12 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation Header */}
            <div className="flex items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono uppercase tracking-widest">Library / Course Details</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Scrollable Content Section */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <CourseHero course={course} />
                    <CourseAbout description={course.description} />
                    <CourseCurriculum weeks={course.weeks} hasAccess={course.hasAccess} />
                </div>

                {/* Sticky Action Section */}
                <aside className="lg:col-span-4">
                    <CourseActionSidebar course={course} />
                </aside>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
