import React, { useEffect, useState } from 'react';
import { PenTool, CheckCircle, AlertCircle } from 'lucide-react';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { useUpdateCourse } from '@domain/useCase/useUpdateCourse';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { CourseForm } from '@presentation/feature/course/components/CourseForm';

export const CourseMetadataEditor = ({ courseId }) => {
    const { fetchCoursePreview, coursePreview, loading: isFetching, error: fetchError } = useFetchCoursePreview();
    const { updateCourse, inProgress: isUpdating, error: updateError } = useUpdateCourse();
    const { upload, inProgress: isUploading } = useUploadMedia();
    
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (courseId) {
            fetchCoursePreview(courseId);
        }
    }, [courseId, fetchCoursePreview]);

    const handleSubmit = async (dtoData, imageFile) => {
        setSuccessMessage('');
        let finalPictureId = dtoData.picture;

        // 1. Upload new image if provided
        if (imageFile) {
            const uploadResult = await upload([imageFile]);
            if (uploadResult && uploadResult.length > 0) {
                finalPictureId = uploadResult[0].id;
            }
        }

        // 2. Update Course
        const payload = {
            ...dtoData,
            picture: finalPictureId
        };
        
        await updateCourse({ id: courseId, data: payload });
        
        if (!updateError) {
            setSuccessMessage('Course metadata updated successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            fetchCoursePreview(courseId); // Refresh data
        }
    };

    if (isFetching || !coursePreview) {
        return (
            <div className="flex items-center justify-center p-12 text-text-muted animate-pulse">
                Loading course metadata...
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                <AlertCircle size={20} />
                <p>Failed to load course: {fetchError}</p>
            </div>
        );
    }

    const isLoading = isUpdating || isUploading;

    return (
        <div className="animation-fade-in space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                        <PenTool size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Course Metadata</h2>
                        <p className="text-xs text-text-muted">Edit basic details, difficulty, categorization, and the course display thumbnail.</p>
                    </div>
                </div>
                
                {successMessage && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium animation-fade-in">
                        <CheckCircle size={14} />
                        {successMessage}
                    </div>
                )}
            </div>

            <CourseForm 
                initialData={coursePreview}
                isLoading={isLoading}
                onSubmit={handleSubmit}
            />
            
            {updateError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
                    <AlertCircle size={16} />
                    <p>{updateError}</p>
                </div>
            )}
        </div>
    );
};
