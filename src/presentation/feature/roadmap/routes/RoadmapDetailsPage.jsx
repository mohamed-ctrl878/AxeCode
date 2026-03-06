import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Map } from 'lucide-react';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { RoadmapDetailsSkeleton } from '@presentation/shared/components/skeletons/RoadmapDetailsSkeleton';
import { useFetchRoadmaps } from '@domain/useCase/useFetchRoadmaps';

/**
 * RoadmapDetailsPage: Displays an interactive roadmap flowchart.
 * Currently uses useFetchRoadmaps and filters by ID as a fallback for singular fetch.
 */
const RoadmapDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchRoadmaps, roadmaps, loading, error } = useFetchRoadmaps();
    const [roadmap, setRoadmap] = useState(null);

    useEffect(() => {
        fetchRoadmaps();
    }, [fetchRoadmaps]);

    useEffect(() => {
        if (roadmaps && id) {
            const found = roadmaps.find(r => r.uid === id || r.id === id);
            setRoadmap(found);
        }
    }, [roadmaps, id]);

    if (loading) return <RoadmapDetailsSkeleton />;

    if (error || (!loading && !roadmap)) {
        return (
            <div className="md:col-span-12 flex flex-col items-center justify-center py-20 gap-4">
                <Map size={48} className="text-red-400 opacity-20" />
                <p className="text-text-muted font-mono text-sm">Roadmap not found or failed to load.</p>
                <button 
                    onClick={() => navigate('/roadmaps')}
                    className="px-6 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-light transition-colors"
                >
                    Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="md:col-span-12 w-full h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-xl bg-surface border border-border-subtle hover:text-accent-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-glow-blue">{roadmap.title}</h1>
                        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                            Learning Architecture • {roadmap.nodeCount} Stages
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-background rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                        <Share2 size={16} /> Share Path
                    </button>
                </div>
            </div>

            {/* Main Interactive Canvas */}
            <div className="flex-1 bento-card p-0 overflow-hidden border border-border-subtle group">
                <FlowPreviewer 
                    nodes={roadmap.flowData?.nodes || []} 
                    edges={roadmap.flowData?.edges || []} 
                    className="h-full border-none rounded-none"
                />
            </div>
        </div>
    );
};

export default RoadmapDetailsPage;
