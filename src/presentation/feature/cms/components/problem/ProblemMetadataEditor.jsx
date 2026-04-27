import React, { useEffect } from 'react';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';
import { useUpdateProblem } from '@domain/useCase/useUpdateProblem';
import { ProblemForm } from './ProblemForm';
import { Loader2, AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';
import { useState } from 'react';
import { CMSSuccessModal } from '@presentation/shared/components/CMSSuccessModal';

/**
 * ProblemMetadataEditor: Handles fetching and updating a single problem's core metadata.
 * 
 * @param {object} props
 * @param {string} props.problemId - The documentId of the problem to edit.
 */
export const ProblemMetadataEditor = ({ problemId }) => {
    const { fetchProblem, problem, loading, error: fetchError } = useFetchProblem();
    const { updateProblem, inProgress: isUpdating, error: updateError } = useUpdateProblem();
    const { uploadMedia, inProgress: isUploading } = useUploadMedia();
    
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (problemId) {
            fetchProblem(problemId);
        }
    }, [problemId, fetchProblem]);

    const handleSubmit = async (dtoData, pictureFile) => {
        try {
            let finalPictureId = dtoData.picture;

            // 1. Upload new picture if provided
            if (pictureFile) {
                const uploadResult = await uploadMedia(pictureFile);
                if (uploadResult && uploadResult[0]) {
                    finalPictureId = uploadResult[0];
                }
            }

            // 2. Perform Update
            await updateProblem({ 
                id: problemId, 
                data: {
                    ...dtoData,
                    picture: finalPictureId
                } 
            });

            // 3. Re-fetch and show success
            await fetchProblem(problemId);
            setShowSuccess(true);
        } catch (err) {
            console.error("[ProblemMetadataEditor] Update failed:", err);
        }
    };

    if (loading && !problem) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-muted animate-pulse">
                <Loader2 size={48} className="animate-spin mb-6 text-accent-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Synchronizing Metadata Schema...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-6 text-red-500 shadow-lg animation-slide-up">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle size={32} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest italic">Sync Failure</h3>
                    <p className="text-xs font-bold mt-1 opacity-80">{fetchError.message || "Failed to establish a connection with the metadata protocol."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animation-fade-in w-full max-w-6xl mx-auto mb-8">
            {updateError && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 shadow-whisper">
                    <AlertCircle size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{updateError.message || "Mutation failed. Check the payload for anomalies."}</span>
                </div>
            )}

            {problem && (
                <ProblemForm 
                    initialData={problem}
                    isLoading={isUpdating || isUploading}
                    onSubmit={handleSubmit}
                />
            )}

            <CMSSuccessModal 
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Protocol Updated"
                message="The algorithmic metadata schema has been successfully synchronized and committed to the core database."
                primaryActionLabel="Stay Here"
                secondaryActionLabel="Close Protocol"
                icon={Save}
            />
        </div>
    );
};
