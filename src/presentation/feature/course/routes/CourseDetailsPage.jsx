import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { CourseHero } from '../components/CourseHero';
import { CourseAbout } from '../components/CourseAbout';
import { CourseCurriculum } from '../components/CourseCurriculum';
import { CourseActionSidebar } from '../components/CourseActionSidebar';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';

/**
 * CourseDetailsPage: Assembly of course details components.
 * Fetches real course data via useFetchCoursePreview use case.
 * Follows SRP by delegating rendering to specialized sub-components.
 */
const CourseDetailsPage = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const { fetchCoursePreview, coursePreview, loading, error } = useFetchCoursePreview();

    useEffect(() => {
        if (documentId) {
            fetchCoursePreview(documentId);
        }
    }, [documentId]);

    if (loading) {
        return (
            <div className="md:col-span-12 flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="animate-spin text-accent-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="md:col-span-12 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertTriangle size={48} className="text-red-400" />
                <p className="text-text-muted text-center">{error}</p>
                <button
                    onClick={() => fetchCoursePreview(documentId)}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:opacity-90 transition-opacity font-mono text-sm uppercase tracking-wider"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!coursePreview) return null;

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
                    <CourseHero course={coursePreview} />
                    <CourseAbout description={coursePreview.description} />
                    <CourseCurriculum weeks={coursePreview.weeks} hasAccess={coursePreview.hasAccess} />
                </div>

                {/* Sticky Action Section */}
                <aside className="lg:col-span-4">
                    <CourseActionSidebar course={coursePreview} />
                </aside>
            </div>
        </div>
    );
};

export default CourseDetailsPage;

