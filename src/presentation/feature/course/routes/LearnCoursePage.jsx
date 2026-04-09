import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { useFetchLesson } from '@domain/useCase/useFetchLesson';
import { useMarkLessonAsCompleted } from '@domain/useCase/useMarkLessonAsCompleted';
import { LearnSidebar } from '../components/LearnSidebar';
import { LessonViewer } from '../components/LessonViewer';
import { Loader2, AlertCircle } from 'lucide-react';
import '../styles/LearnCourse.css';

/**
 * LearnCoursePage: Orchestrator for the learning experience.
 * Manages course structure, current lesson content, and navigation logic.
 */
const LearnCoursePage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    // --- Domain UseCases ---
    const { fetchCoursePreview, coursePreview, loading: courseLoading, error: courseError } = useFetchCoursePreview();
    const { fetchLesson, lesson, loading: lessonLoading, error: lessonError } = useFetchLesson();
    const { markAsCompleted } = useMarkLessonAsCompleted();

    // Initialize course data
    useEffect(() => {
        if (courseId) fetchCoursePreview(courseId);
    }, [courseId, fetchCoursePreview]);

    // Initialize/Update lesson data
    useEffect(() => {
        if (lessonId) fetchLesson(lessonId);
    }, [lessonId, fetchLesson]);

    // Flatten all lessons across weeks for easier navigation logic
    const allLessonsFlat = useMemo(() => {
        if (!coursePreview) return [];
        return coursePreview.weeks.flatMap(week => week.lessons);
    }, [coursePreview]);

    // Find current index and neighbors
    const currentIndex = useMemo(() => {
        return allLessonsFlat.findIndex(l => String(l.uid || l.id) === String(lessonId));
    }, [allLessonsFlat, lessonId]);

    const hasNext = currentIndex < allLessonsFlat.length - 1;
    const hasPrev = currentIndex > 0;

    const navigateToLesson = useCallback((dir) => {
        const nextIdx = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
        const targetLesson = allLessonsFlat[nextIdx];
        if (targetLesson) {
            const targetId = targetLesson.uid || targetLesson.id;
            navigate(`/courses/${courseId}/learn/lesson/${targetId}`);
        }
    }, [currentIndex, allLessonsFlat, courseId, navigate]);

    // --- Loading & Error States ---
    if (courseLoading && !coursePreview) {
        return (
            <div className="md:col-span-12 h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="animate-spin text-accent-primary mb-4" size={48} />
                <p className="text-text-muted font-bold tracking-widest uppercase text-xs">Opening Library...</p>
            </div>
        );
    }

    if (courseError) {
        return (
            <div className="md:col-span-12 h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
                <div className="bento-card p-12 max-w-lg border-status-error/20">
                    <AlertCircle className="text-status-error mx-auto mb-6" size={64} />
                    <h2 className="text-2xl font-serif font-medium text-text-primary mb-2">Restricted Knowledge</h2>
                    <p className="text-text-muted text-sm mb-8">{courseError}</p>
                    <button 
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="px-6 py-3 bg-surface border border-border-subtle rounded-xl text-sm font-bold hover:bg-surface-elevated transition-all"
                    >
                        Return to Course Details
                    </button>
                </div>
            </div>
        );
    }

    if (!coursePreview) return null;

    return (
        <div className="md:col-span-12 learn-layout">
            <LearnSidebar 
                course={coursePreview} 
                currentLessonId={lessonId} 
            />
            
            <LessonViewer 
                lesson={lesson} 
                courseId={courseId}
                loading={lessonLoading}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onNext={() => navigateToLesson('next')}
                onPrev={() => navigateToLesson('prev')}
                onComplete={(lid) => markAsCompleted({ lessonId: lid, courseId })}
            />
        </div>
    );
};

export default LearnCoursePage;
