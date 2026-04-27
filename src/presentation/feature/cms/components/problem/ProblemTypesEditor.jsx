import React, { useState, useEffect } from 'react';
import { Layers, Save, Loader2, AlertCircle, CheckCircle2, Tags } from 'lucide-react';
import { useFetchAdminCategorizations } from '@domain/useCase/useFetchAdminCategorizations';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';
import { useUpdateProblem } from '@domain/useCase/useUpdateProblem';
import { cn } from '@core/utils/cn';

/**
 * ProblemTypesEditor: Manages the relationship between a Problem and its Categorization Tracks.
 */
export const ProblemTypesEditor = ({ problemId }) => {
    const { problem, fetchProblem, loading: isFetchingProblem } = useFetchProblem();
    const { problemTypes, isLoading: isFetchingTypes } = useFetchAdminCategorizations();
    const { updateProblem, inProgress: isUpdating } = useUpdateProblem();

    const [selectedTypeIds, setSelectedTypeIds] = useState([]);
    const [status, setStatus] = useState({ type: null, message: '' });

    // Load initial state
    useEffect(() => {
        if (problemId) {
            fetchProblem(problemId);
        }
    }, [problemId, fetchProblem]);

    // Sync selected types when problem data arrives
    useEffect(() => {
        if (problem?.problemTypes) {
            setSelectedTypeIds(problem.problemTypes.map(pt => pt.id || pt.documentId));
        }
    }, [problem]);

    const handleToggleType = (typeId) => {
        setSelectedTypeIds(prev => 
            prev.includes(typeId) 
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    const showStatus = (type, message) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    };

    const handleSave = async () => {
        try {
            await updateProblem({ 
                id: problemId, 
                data: { 
                    problemTypeIds: selectedTypeIds 
                } 
            });
            showStatus('success', 'Problem taxonomy updated successfully.');
            // Refresh local state
            fetchProblem(problemId);
        } catch (err) {
            showStatus('error', err.message || 'Failed to update taxonomy.');
        }
    };

    const isLoading = isFetchingProblem || isFetchingTypes;

    if (isLoading && !problem) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                <Loader2 size={32} className="animate-spin mb-4 text-accent-primary" />
                <p className="text-sm font-medium animate-pulse">Synchronizing Taxonomy Engine...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-subtle pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-accent-primary/10 text-accent-primary shadow-sm">
                            <Tags size={20} />
                        </div>
                        <h2 className="text-2xl font-serif font-medium text-text-primary">Problem Classification</h2>
                    </div>
                    <p className="text-[13px] text-text-muted leading-relaxed max-w-xl">
                        Associate this problem with specific categories and tracks. This mapping determines where the problem will be discoverable within the catalog and curriculum.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {status.type === 'success' && (
                        <div className="flex items-center gap-2 text-accent-emerald text-[11px] font-bold uppercase tracking-wider bg-accent-emerald/10 px-3 py-2 rounded-lg border border-accent-emerald/20 animate-in zoom-in">
                            <CheckCircle2 size={14} />
                            {status.message}
                        </div>
                    )}
                    {status.type === 'error' && (
                        <div className="flex items-center gap-2 text-accent-red text-[11px] font-bold uppercase tracking-wider bg-accent-red/10 px-3 py-2 rounded-lg border border-accent-red/20 animate-in shake">
                            <AlertCircle size={14} />
                            {status.message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50",
                            "bg-accent-primary text-white hover:bg-accent-primary/90 shadow-accent-primary/20"
                        )}
                    >
                        {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isUpdating ? 'Executing Update...' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            {/* Grid of Potential Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {problemTypes.length === 0 ? (
                    <div className="col-span-full py-16 text-center bg-surface-sunken/40 border border-dashed border-border-default rounded-[2rem]">
                        <p className="text-sm text-text-muted font-medium italic">No taxonomy tracks defined in system.</p>
                    </div>
                ) : (
                    problemTypes.map((type) => {
                        const isSelected = selectedTypeIds.includes(type.id || type.documentId);
                        return (
                            <button
                                key={type.id || type.documentId}
                                onClick={() => handleToggleType(type.id || type.documentId)}
                                className={cn(
                                    "flex flex-col items-start p-5 rounded-2xl border transition-all text-left group relative overflow-hidden",
                                    isSelected 
                                        ? "bg-accent-primary/5 border-accent-primary shadow-sm ring-1 ring-accent-primary/20" 
                                        : "bg-surface border-border-subtle hover:border-text-muted/30 hover:bg-surface-sunken/40"
                                )}
                            >
                                <div className="flex items-center justify-between w-full mb-3">
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        isSelected ? "bg-accent-primary text-white" : "bg-surface-sunken text-text-muted group-hover:text-text-primary"
                                    )}>
                                        <Layers size={14} />
                                    </div>
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                                    )}
                                </div>
                                
                                <span className={cn(
                                    "text-sm font-bold tracking-tight mb-1",
                                    isSelected ? "text-text-primary" : "text-text-muted group-hover:text-text-primary"
                                )}>
                                    {type.title}
                                </span>
                                <span className="text-[10px] text-text-muted opacity-60 leading-relaxed font-medium">
                                    {type.description || 'Global classification track for algorithmic problems.'}
                                </span>

                                {isSelected && (
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-accent-primary/5 rounded-bl-[3rem] pointer-events-none" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Empty State / Footer Info */}
            <div className="p-6 rounded-2xl bg-surface-sunken/30 border border-border-subtle flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-text-muted">
                    <AlertCircle size={16} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary">Architecture Governance</h4>
                    <p className="text-[11px] text-text-muted opacity-80 leading-relaxed max-w-2xl">
                        Selection of multiple classification tracks is supported. However, it is recommended to keep associations relevant to maintain a clean student navigation experience. Changes are versioned and audited.
                    </p>
                </div>
            </div>
        </div>
    );
};
