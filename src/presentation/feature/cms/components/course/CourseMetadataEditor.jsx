import React, { useEffect, useState } from 'react';
import { PenTool, CheckCircle, AlertCircle } from 'lucide-react';
import { useFetchCoursePreview } from '@domain/useCase/useFetchCoursePreview';
import { useUpdateCourse } from '@domain/useCase/useUpdateCourse';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { CourseForm } from '@presentation/feature/course/components/CourseForm';

export const CourseMetadataEditor = ({ courseId }) => {
    const { fetchCoursePreview, coursePreview, loading: isFetching, error: fetchError } = useFetchCoursePreview();
    const { updateCourse, inProgress: isUpdating, error: updateError } = useUpdateCourse();
    const { uploadMedia, inProgress: isUploading } = useUploadMedia();
    
    console.log("coursePreview",coursePreview)
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
            const uploadResult = await uploadMedia([imageFile]);
            if (uploadResult && uploadResult.length > 0) {
                finalPictureId = uploadResult[0];
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
            <div className="p-6 bg-status-error/10 border border-status-error/20 rounded-xl text-status-error flex items-center gap-3">
                <AlertCircle size={20} />
                <p>Failed to load course: {fetchError}</p>
            </div>
        );
    }

    const isLoading = isUpdating || isUploading;

    return (
        <div className="animation-fade-in space-y-8 w-full max-w-6xl pb-12">
            {/* Minimalist Tab Heading */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border-subtle shadow-whisper text-accent-primary flex items-center justify-center shrink-0">
                        <PenTool size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-medium tracking-tight">Technical Manuscript</h2>
                        <p className="text-[11px] text-text-muted uppercase tracking-widest font-bold opacity-60">Metadata & Core Configuration</p>
                    </div>
                </div>
                
                {successMessage && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald rounded-xl text-xs font-bold animation-fade-in shadow-sm">
                        <CheckCircle size={16} />
                        {successMessage.toUpperCase()}
                    </div>
                )}
            </div>

            <CourseForm 
                initialData={coursePreview}
                isLoading={isLoading}
                onSubmit={handleSubmit}
            />
            
            {updateError && (
                <div className="p-4 bg-accent-rose/10 border border-accent-rose/20 rounded-xl text-accent-rose text-sm flex items-center gap-3 mx-1">
                    <AlertCircle size={18} />
                    <p className="font-medium">{updateError}</p>
                </div>
            )}
        </div>
    );
};
