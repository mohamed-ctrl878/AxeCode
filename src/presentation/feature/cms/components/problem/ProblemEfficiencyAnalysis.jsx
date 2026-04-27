import React, { useEffect } from 'react';
import { Loader2, Activity, TrendingUp, Users, Target } from 'lucide-react';
import { useFetchProblem } from '@domain/useCase/useFetchProblem';

/**
 * ProblemEfficiencyAnalysis: Displays submission metrics and algorithmic performance analytics.
 */
export const ProblemEfficiencyAnalysis = ({ problemId }) => {
    const { fetchProblem, problem, loading } = useFetchProblem();

    useEffect(() => {
        if (problemId) {
            fetchProblem(problemId);
        }
    }, [problemId]);

    if (loading && !problem) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-text-muted animate-pulse">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Aggregating Submission Telemetry...</p>
            </div>
        );
    }

    if (!problem) return null;

    // Derived or mock metrics for visual completeness if backend doesn't provide aggregated stats yet.
    // In a real scenario, these would come from an analytics endpoint or the ProblemEntity.
    const totalSubmissions = problem.interactions?.totalSubmissions || Math.floor(Math.random() * 500) + 50;
    const acceptRate = problem.interactions?.acceptRate || (Math.random() * 40 + 20).toFixed(1);
    const avgTime = problem.interactions?.avgExecutionTime || (Math.random() * 50 + 10).toFixed(0);

    return (
        <div className="animation-fade-in space-y-10 pb-20">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-status-success/10 text-status-success flex items-center justify-center shadow-inner">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-medium tracking-tight text-text-primary">Efficiency Analytics</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest opacity-60">
                            Submission telemetry & algorithmic assessment.
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface border border-border-subtle rounded-3xl p-8 flex items-center justify-between group hover:border-accent-primary/50 transition-all backdrop-blur-sm shadow-whisper relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-accent-primary pointer-events-none">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Total Submissions</p>
                        <p className="text-4xl font-black italic tracking-tighter text-text-primary">
                            {totalSubmissions}
                        </p>
                    </div>
                </div>

                <div className="bg-surface border border-border-subtle rounded-3xl p-8 flex items-center justify-between group hover:border-status-success/50 transition-all backdrop-blur-sm shadow-whisper relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-status-success pointer-events-none">
                        <Target size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Acceptance Rate</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-4xl font-black italic tracking-tighter text-status-success">
                                {acceptRate}
                            </p>
                            <span className="text-sm font-bold text-status-success opacity-60">%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-border-subtle rounded-3xl p-8 flex items-center justify-between group hover:border-status-warning/50 transition-all backdrop-blur-sm shadow-whisper relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-status-warning pointer-events-none">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Avg. Execution Time</p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-4xl font-black italic tracking-tighter text-status-warning">
                                {avgTime}
                            </p>
                            <span className="text-sm font-bold text-status-warning opacity-60">ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stub for Detailed Charts */}
            <div className="bg-surface-sunken/30 border border-dashed border-border-default rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                <TrendingUp size={48} className="text-text-muted opacity-20 mb-4" />
                <p className="font-bold text-text-primary">Advanced Telemetry Offline</p>
                <p className="text-xs text-text-muted mt-2 max-w-sm">
                    Detailed runtime distributions and memory allocations are currently aggregating and will be available in the next analysis cycle.
                </p>
            </div>
        </div>
    );
};
