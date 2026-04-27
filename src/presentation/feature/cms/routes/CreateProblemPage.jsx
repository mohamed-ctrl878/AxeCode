import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProblem } from '@domain/useCase/useCreateProblem';
import { ProblemForm } from '../components/problem/ProblemForm';
import { AlertCircle, ChevronLeft, Code2 } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { CMSSuccessModal } from '@presentation/shared/components/CMSSuccessModal';
import { useUploadMedia } from '@domain/useCase/useUploadMedia';

/**
 * Page orchestrator for creating a new algorithmic Problem.
 * Note: Backend lifecycles will automatically handle code template generation.
 */
const CreateProblemPage = () => {
    const navigate = useNavigate();
    const { createProblem, inProgress: isCreating, error } = useCreateProblem();
    const { uploadMedia, inProgress: isUploading } = useUploadMedia();
    
    // Local processing state
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdId, setCreatedId] = useState(null);

    const handleSubmit = async (dtoData, pictureFile) => {
        setIsProcessing(true);
        try {
            let finalPictureId = dtoData.picture;

            // 1. Upload picture if provided
            if (pictureFile) {
                const uploadResult = await uploadMedia(pictureFile);
                if (uploadResult && uploadResult[0]) {
                    finalPictureId = uploadResult[0];
                }
            }

            // 2. Dispatch API Request
            const payload = {
                ...dtoData,
                picture: finalPictureId
            };

            const response = await createProblem(payload);
            const created = response?.data || response;

            if (created && created.documentId) {
                setCreatedId(created.documentId);
                setShowSuccess(true);
            }

        } catch (err) {
            console.error("Problem creation failed:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const isBusy = isCreating || isProcessing || isUploading;

    return (
        <div className="md:col-span-full w-full pt-8 pb-12 px-4 md:px-8 animation-fade-in text-text-primary flex flex-col items-center">
            {/* Header with Glassmorphism - Premium styling consistent with Courses */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-8 rounded-[2.5rem] bg-surface border border-border-subtle backdrop-blur-md shadow-whisper relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-accent-primary">
                    <Code2 size={120} />
                </div>

                <div className="flex items-center gap-5 relative z-10">
                    <button 
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/problems`)}
                        className="w-12 h-12 rounded-2xl border border-border-default flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0 bg-surface-sunken/40"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight text-text-primary italic">Create Problem</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-accent-primary/10 border border-accent-primary/20 text-accent-primary uppercase tracking-widest mt-1">Initiating Protocol</span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">Define technical signature and algorithmic constraints.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button
                        type="button"
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/problems`)}
                        className="px-6 py-3 rounded-2xl text-text-muted hover:text-text-primary font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Abort
                    </button>
                </div>
            </div>

            <div className="w-full max-w-6xl mb-8">
                {error && (
                    <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-4 text-red-500 shadow-whisper">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Protocol Sync Failure</p>
                            <p className="text-xs font-bold mt-1 opacity-80">{error.message || "An error occurred while establishing the algorithmic node."}</p>
                        </div>
                    </div>
                )}
                
                <ProblemForm 
                    onSubmit={handleSubmit} 
                    isLoading={isBusy} 
                />
            </div>

            <CMSSuccessModal 
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Problem Catalogued"
                message="The algorithmic signature has been successfully committed. You may now orchestration the validation suite (Test Cases)."
                primaryActionLabel="Orchestrate Validation"
                primaryActionLink={`${PATHS.CONTENT_MANAGEMENT}/problems/${createdId}/test-cases`}
                secondaryActionLabel="Return to Archives"
                secondaryActionLink={`${PATHS.CONTENT_MANAGEMENT}/problems`}
                icon={Code2}
            />
        </div>
    );
};

export default CreateProblemPage;
