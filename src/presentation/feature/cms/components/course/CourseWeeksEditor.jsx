import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { useCreateWeek } from '@domain/useCase/useCreateWeek';
import { useUpdateWeek } from '@domain/useCase/useUpdateWeek';
import { useDeleteWeek } from '@domain/useCase/useDeleteWeek';
import { useDeleteLesson } from '@domain/useCase/useDeleteLesson';
import { WeekList } from './WeekList';
import { WeekFormModal } from './WeekFormModal';

/**
 * CourseWeeksEditor: Orchestrator for the Schedule Weeks tab.
 * Follows SRP: Manages state, delegates rendering to WeekList and WeekFormModal.
 *
 * @param {object} props
 * @param {string} props.courseId - The documentId of the course being managed
 */
export const CourseWeeksEditor = ({ courseId }) => {
    const { fetchCoursePreview, coursePreview, loading: isFetching, error: fetchError } = useFetchCoursePreview();
    const { createWeek, inProgress: isCreating } = useCreateWeek();
    const { updateWeek, inProgress: isUpdating } = useUpdateWeek();
    const { deleteWeek, inProgress: isDeleting } = useDeleteWeek();
    const { deleteLesson, inProgress: isDeletingLesson } = useDeleteLesson();

    // Week Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWeek, setEditingWeek] = useState(null);

    // Fetch course data including weeks
    const refreshData = useCallback(() => {
        if (courseId) fetchCoursePreview(courseId);
    }, [courseId, fetchCoursePreview]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // --- Handlers ---
    const handleOpenCreate = () => {
        setEditingWeek(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (week) => {
        setEditingWeek(week);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingWeek(null);
    };

    const handleSubmit = async (title) => {
        try {
            if (editingWeek) {
                // Update existing week
                const weekId = editingWeek.documentId || editingWeek.id;
                await updateWeek({ id: weekId, data: { title, courseId } });
            } else {
                // Create new week
                await createWeek({ title, courseId });
            }
            handleCloseModal();
            refreshData(); // Refresh the list
        } catch (err) {
            console.error('[WeeksEditor] Operation failed:', err);
        }
    };

    const handleDelete = async (week) => {
        const weekId = week.documentId || week.id;
        const confirmed = window.confirm(`Are you sure you want to delete "${week.title || 'this week'}"?`);
        if (!confirmed) return;

        try {
            await deleteWeek(weekId);
            refreshData();
        } catch (err) {
            console.error('[WeeksEditor] Delete failed:', err);
        }
    };

    const handleDeleteLesson = async (lesson) => {
        const lessonId = lesson.uid || lesson.id;
        const confirmed = window.confirm(`Are you sure you want to delete "${lesson.title || 'this lesson'}"?`);
        if (!confirmed) return;

        try {
            await deleteLesson(lessonId);
            refreshData();
        } catch (err) {
            console.error('[WeeksEditor] Lesson deletion failed:', err);
        }
    };

    // --- Render ---
    if (isFetching && !coursePreview) {
        return (
            <div className="flex items-center justify-center p-12 text-text-muted animate-pulse">
                Loading course schedule...
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                <AlertCircle size={20} />
                <p>Failed to load course data: {fetchError}</p>
            </div>
        );
    }

    const weeks = coursePreview?.weeks || [];
    const isMutating = isCreating || isUpdating || isDeleting || isDeletingLesson;

    return (
        <div className="animation-fade-in space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Schedule Weeks</h2>
                        <p className="text-xs text-text-muted">
                            Manage the weekly modules that structure this course's curriculum.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreate}
                    disabled={isMutating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-accent-primary hover:bg-accent-secondary text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    <Plus size={16} />
                    Add Week
                </button>
            </div>

            {/* Week Counter */}
            <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="px-2 py-0.5 rounded bg-white/5 font-mono">{weeks.length}</span>
                <span>weeks scheduled</span>
                {isMutating && (
                    <span className="ml-auto text-accent-primary animate-pulse text-[10px]">Saving...</span>
                )}
            </div>

            {/* Delegated List */}
            <WeekList
                courseId={courseId}
                weeks={weeks}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onDeleteLesson={handleDeleteLesson}
            />

            {/* Week Modal */}
            <WeekFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                editingWeek={editingWeek}
                isLoading={isMutating}
            />
        </div>
    );
};
