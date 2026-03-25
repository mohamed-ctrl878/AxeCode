import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCourse } from '@domain/useCase/useCreateCourse';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { CourseForm } from '../components/CourseForm';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';

/**
 * Page orchestrator for creating a new Course using clean architecture.
 * Manages media uploading and payload mapping before dispatching the creation DTO.
 */
const CreateCoursePage = () => {
    const navigate = useNavigate();
    const { createCourse, inProgress: isCreating, error: createError } = useCreateCourse();
    const { uploadMedia, isUploading, error: uploadError } = useUploadMedia();
    
    // Local processing state
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (formData, imageFile) => {
        setIsProcessing(true);
        try {
            // Step 1: Upload image if provided
            let mediaId = null;
            if (imageFile) {
                const uploadResult = await uploadMedia({
                    file: imageFile,
                    ref: 'api::course.course',
                    field: 'picture'
                });
                
                // Assuming useUploadMedia returns an array of uploaded objects or a single object
                if (Array.isArray(uploadResult) && uploadResult.length > 0) {
                    mediaId = uploadResult[0].id;
                } else if (uploadResult?.id) {
                    mediaId = uploadResult.id;
                }
            }

            // Step 2: Attach picture ID to request data
            const coursePayload = {
                ...formData,
                picture: mediaId || formData.picture
            };

            // Step 3: Dispatch API Request
            const response = await createCourse(coursePayload);
            const createdCourse = response?.data || response;

            if (createdCourse && createdCourse.documentId) {
                // Navigate back to CMS course management
                navigate(`${PATHS.CONTENT_MANAGEMENT}/courses`);
            }

        } catch (err) {
            console.error("Course creation failed:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const isBusy = isCreating || isUploading || isProcessing;
    const activeError = createError || uploadError;

    return (
        <div className="md:col-span-12 min-h-screen pt-24 pb-12 px-4 sm:px-6 relative z-10 w-full">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto mb-8 w-full">
                <button 
                    onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/courses`)}
                    className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-4 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Courses</span>
                </button>

                {activeError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-sm">{activeError.message || typeof activeError === 'string' ? activeError : "An unexpected error occurred."}</span>
                    </div>
                )}
                
                <CourseForm 
                    onSubmit={handleSubmit} 
                    isLoading={isBusy} 
                />
            </div>
        </div>
    );
};

export default CreateCoursePage;
