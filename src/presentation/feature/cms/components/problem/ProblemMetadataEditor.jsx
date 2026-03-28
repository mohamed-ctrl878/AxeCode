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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted">
                <Loader2 size={32} className="animate-spin mb-4 text-accent-primary" />
                <p className="text-sm font-medium">Synchronizing problem data...</p>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400">
                <AlertCircle size={24} />
                <div>
                    <h3 className="font-bold">Sync Error</h3>
                    <p className="text-sm opacity-80">{fetchError.message || "Failed to load problem metadata."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {updateError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{updateError.message || "Update failed."}</span>
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
