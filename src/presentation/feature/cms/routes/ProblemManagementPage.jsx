import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Database, Activity, Code2 } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

// Subcomponents
import { ProblemMetadataEditor } from '../components/problem/ProblemMetadataEditor';
import { ProblemTestCaseManager } from '../components/problem/ProblemTestCaseManager';

/**
 * ProblemManagementPage: Orchestrates the unified tab view for configuring an algorithmic problem.
 */
export const ProblemManagementPage = () => {
    const { id, topic } = useParams();
    const navigate = useNavigate();

    // Valid Topics Enforcer
    const validTopics = ['edit', 'test-cases', 'templates', 'analysis'];
    if (!validTopics.includes(topic)) {
        return <Navigate to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/edit`} replace />;
    }

    // Tabs Definition
    const tabs = useMemo(() => [
        { id: 'edit', label: 'Metadata Schema', icon: Edit2 },
        { id: 'test-cases', label: 'Validation Suite', icon: Database },
        { id: 'templates', label: 'Code Templates', icon: Code2 },
        { id: 'analysis', label: 'Efficiency Analysis', icon: Activity }
    ], []);

    // Active Render mapping
    const renderActiveTab = () => {
        switch (topic) {
            case 'edit': return <ProblemMetadataEditor problemId={id} />;
            case 'test-cases': return <ProblemTestCaseManager problemId={id} />;
            case 'templates': return (
                <div className="flex flex-col items-center justify-center py-32 text-text-muted bg-surface-sunken/20 border border-dashed border-border-default rounded-[3rem] animate-pulse">
                    <Code2 size={64} className="mb-6 opacity-10" />
                    <p className="font-black uppercase tracking-[0.2em] italic text-text-primary">Templates Protocol Pending</p>
                    <p className="text-[10px] mt-2 font-bold opacity-40 max-w-[300px] text-center">Language specific starting code snippets will be orchestrated here.</p>
                </div>
            );
            case 'analysis': return (
                <div className="flex flex-col items-center justify-center py-32 text-text-muted bg-surface-sunken/20 border border-dashed border-border-default rounded-[3rem] animate-pulse">
                    <Activity size={64} className="mb-6 opacity-10" />
                    <p className="font-black uppercase tracking-[0.2em] italic text-text-primary">Analysis Protocol Pending</p>
                    <p className="text-[10px] mt-2 font-bold opacity-40 max-w-[300px] text-center">Submission trajectories and aggregate performance metrics will be orchestrated here.</p>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="md:col-span-full animation-fade-in flex flex-col h-[calc(100vh-6rem)] text-text-primary px-4 md:px-8">
            {/* Contextual Header - Redesigned with Glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 p-8 rounded-[2.5rem] bg-surface border border-border-subtle backdrop-blur-md shadow-xl relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-accent-primary">
                    <Code2 size={120} />
                </div>

                <div className="flex items-center gap-6 relative z-10">
                    <button 
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/problems`)}
                        className="w-12 h-12 rounded-2xl border border-border-default flex items-center justify-center text-text-muted hover:border-accent-primary/50 hover:bg-accent-primary/10 hover:text-accent-primary transition-all group shrink-0 bg-surface-sunken/40"
                    >
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black tracking-tight italic">Problem Architect</h1>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black border border-accent-primary/20 bg-accent-primary/10 text-accent-primary uppercase tracking-widest mt-1 shadow-sm">REF: {id}</span>
                        </div>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1 opacity-40">Manage signatures, validation tiers, and solution templates.</p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-surface-sunken/60 border border-border-subtle text-[10px] font-black uppercase tracking-[0.2em] text-text-muted shadow-inner relative z-10">
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                    <span>Algorithmic Design Protocol active</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col bg-surface border border-border-default rounded-[3rem] shadow-xl overflow-visible relative mb-8">
                {/* Unified Tab Bar */}
                <div className="flex items-center gap-10 border-b border-border-subtle px-10 bg-surface backdrop-blur-md sticky top-0 z-20">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = topic === tab.id;
                        return (
                            <Link 
                                key={tab.id}
                                to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/${tab.id}`}
                                className={cn(
                                    "relative py-6 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all group",
                                    isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isActive ? "bg-accent-primary/10 text-accent-primary" : "bg-transparent"
                                )}>
                                    <Icon size={16} />
                                </div>
                                {tab.label}
                                
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-accent-primary shadow-[0_0_15px_rgba(52,211,153,0.3)] rounded-t-full animation-slide-up" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 p-10 overflow-y-auto bg-surface-sunken/10">
                    <div className="animation-fade-in h-full">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemManagementPage;
