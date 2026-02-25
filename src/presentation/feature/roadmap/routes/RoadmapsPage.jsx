import React, { useEffect } from 'react';
import { RoadmapCard } from '../components/RoadmapCard';
import { useFetchRoadmaps } from '@domain/useCase/useFetchRoadmaps';
import { Loader2, AlertTriangle, Map } from 'lucide-react';

/**
 * RoadmapsPage: Displays all learning path roadmaps.
 * Fetches real data via useFetchRoadmaps use case.
 */
const RoadmapsPage = () => {
    const { fetchRoadmaps, roadmaps, loading, error } = useFetchRoadmaps();

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    return (
        <div className="md:col-span-12 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                        <Map size={20} className="text-accent-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Learning Paths</h1>
                        <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                            Structured roadmaps to guide your journey
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-2 text-text-muted">
                    <Loader2 size={20} className="animate-spin text-accent-primary" />
                    <span className="text-sm font-mono">Loading roadmaps...</span>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <AlertTriangle size={40} className="text-red-400" />
                    <p className="text-text-muted text-center text-sm">{error}</p>
                    <button
                        onClick={() => fetchRoadmaps()}
                        className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:opacity-90 transition-opacity font-mono text-sm uppercase tracking-wider"
                    >
                        Retry
                    </button>
                </div>
            ) : !roadmaps || roadmaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-text-muted">
                    <Map size={48} className="opacity-30" />
                    <p className="text-sm font-mono">No roadmaps available yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap, idx) => (
                        <RoadmapCard key={roadmap.uid || idx} roadmap={roadmap} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoadmapsPage;
