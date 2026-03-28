import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Database, Activity, Code2 } from 'lucide-react';
import { PATHS } from '@presentation/routes/paths';
import { cn } from '@core/utils/cn';

// Subcomponents (To be created)
import { ProblemMetadataEditor } from '../components/problem/ProblemMetadataEditor';
import { ProblemTestCaseManager } from '../components/problem/ProblemTestCaseManager';

/**
 * ProblemManagementPage: Orchestrates the unified tab view for configuring an algorithmic problem.
 */
export const ProblemManagementPage = () => {
    const { id, topic } = useParams();
    const navigate = useNavigate();

    // Valid Topics Enforcer
    const validTopics = ['edit', 'test-cases', 'analysis'];
    if (!validTopics.includes(topic)) {
        return <Navigate to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/edit`} replace />;
    }

    // Tabs Definition
    const tabs = useMemo(() => [
        { id: 'edit', label: 'Problem Metadata', icon: Edit2 },
        { id: 'test-cases', label: 'Test Cases', icon: Database },
        { id: 'analysis', label: 'Submission Analysis', icon: Activity }
    ], []);

    // Active Render mapping
    const renderActiveTab = () => {
        switch (topic) {
            case 'edit': return <ProblemMetadataEditor problemId={id} />;
            case 'test-cases': return <ProblemTestCaseManager problemId={id} />;
            case 'analysis': return (
                <div className="flex flex-col items-center justify-center p-20 text-text-muted bento-card border-dashed">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">Submission Analysis Coming Soon</p>
                    <p className="text-xs">Individual and aggregate performance metrics for this problem.</p>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="md:col-span-12 animation-fade-in flex flex-col h-[calc(100vh-4rem)] text-white">
            {/* Contextual Header */}
            <div className="flex items-center justify-between mb-8 px-8 pt-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(`${PATHS.CONTENT_MANAGEMENT}/problems`)}
                        className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-text-muted hover:border-accent-primary/30 hover:bg-accent-primary/5 hover:text-accent-primary transition-all group shrink-0"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tight">Problem Configuration</h1>
                            <span className="px-2 py-0.5 rounded text-[8px] font-mono border border-accent-primary/20 bg-accent-primary/10 text-accent-primary uppercase tracking-widest mt-1">ID: {id}</span>
                        </div>
                        <p className="text-text-muted text-xs tracking-wide">Manage technical signatures, validation data, and language templates.</p>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark border border-white/5 text-[10px] font-mono text-text-muted">
                    <Code2 size={12} className="text-accent-primary" />
                    <span>Algorithmic Design Mode</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-surface-dark/30 rounded-t-3xl border border-white/5 border-b-0 overflow-hidden mx-8 shadow-2xl">
                {/* Unified Tab Bar */}
                <div className="flex items-center gap-8 border-b border-white/5 px-8 pt-2 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = topic === tab.id;
                        return (
                            <Link 
                                key={tab.id}
                                to={`${PATHS.CONTENT_MANAGEMENT}/problems/${id}/${tab.id}`}
                                className={cn(
                                    "relative px-2 py-4 flex items-center gap-2 text-sm font-bold tracking-tight transition-colors group",
                                    isActive ? "text-white" : "text-text-muted hover:text-white/80"
                                )}
                            >
                                <Icon size={16} className={isActive ? "text-accent-primary" : "opacity-50 group-hover:opacity-100"} />
                                {tab.label}
                                
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary shadow-[0_0_10px_rgba(52,211,153,0.5)] rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    );
};

export default ProblemManagementPage;
