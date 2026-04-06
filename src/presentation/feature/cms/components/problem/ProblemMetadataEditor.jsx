import React, { useEffect } from 'react';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';
import { useUpdateProblem } from '@domain/useCase/useUpdateProblem';
import { ProblemForm } from './ProblemForm';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * ProblemMetadataEditor: Handles fetching and updating a single problem's core metadata.
 * 
 * @param {object} props
 * @param {string} props.problemId - The documentId of the problem to edit.
 */
export const ProblemMetadataEditor = ({ problemId }) => {
    const { fetchProblem, problem, loading, error: fetchError } = useFetchProblem();
    const { updateProblem, inProgress: isUpdating, error: updateError } = useUpdateProblem();

    useEffect(() => {
        if (problemId) {
            fetchProblem(problemId);
        }
    }, [problemId, fetchProblem]);

    const handleSubmit = async (dtoData) => {
        try {
            await updateProblem({ id: problemId, data: dtoData });
            // Re-fetch to sync state after update
            await fetchProblem(problemId);
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
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 w-full px-4 md:px-8">
            {updateError && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 shadow-md">
                    <AlertCircle size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{updateError.message || "Mutation failed. Check the payload for anomalies."}</span>
                </div>
            )}

            {problem && (
                <ProblemForm 
                    initialData={problem}
                    isLoading={isUpdating}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};
