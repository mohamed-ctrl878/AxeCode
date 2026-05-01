import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, Users, Hash, Loader2, X, BarChart3, FileText } from 'lucide-react';
import { GlobalTagRepository } from '../../../../../../infrastructure/repository/GlobalTagRepository';

/**
 * TrendTagsAnalyzer: Displays trending tags with real user interest data.
 * Uses the /api/recommendations/tag-audience endpoint to get actual
 * interested user counts from each user's interest_map.
 */
const TrendTagsAnalyzer = () => {
    const [tags, setTags] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedTagIds, setSelectedTagIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const repository = useMemo(() => new GlobalTagRepository(), []);

    // Fetch tag audience data (real user interest counts)
    useEffect(() => {
        const loadTags = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await repository.getTagAudience();
                setTags(result.tags || []);
                setTotalUsers(result.totalUsers || 0);
            } catch (err) {
                console.error('Failed to fetch tag audience:', err);
                setError('Unable to reach audience engine');
            } finally {
                setIsLoading(false);
            }
        };
        loadTags();
    }, [repository]);

    // Toggle tag selection
    const toggleTag = useCallback((tagName) => {
        setSelectedTagIds(prev => {
            const next = new Set(prev);
            if (next.has(tagName)) {
                next.delete(tagName);
            } else {
                next.add(tagName);
            }
            return next;
        });
    }, []);

    // Clear all selections
    const clearSelection = useCallback(() => {
        setSelectedTagIds(new Set());
    }, []);

    // Calculate stats for selected tags
    const selectedStats = useMemo(() => {
        if (selectedTagIds.size === 0) return null;

        const selectedTags = tags.filter(t => selectedTagIds.has(t.name));
        const totalInterested = selectedTags.reduce((sum, t) => sum + (t.interestedUsers || 0), 0);
        const totalContent = selectedTags.reduce((sum, t) => sum + (t.count || 0), 0);
        const maxTag = selectedTags.reduce((max, t) => (t.interestedUsers || 0) > (max.interestedUsers || 0) ? t : max, selectedTags[0]);

        // Unique users interested (capped at totalUsers since users can overlap)
        const estimatedUnique = Math.min(totalInterested, totalUsers);
        const reachPercent = totalUsers > 0 ? Math.round((estimatedUnique / totalUsers) * 100) : 0;

        return {
            selectedCount: selectedTags.length,
            totalInterested,
            totalContent,
            estimatedUnique,
            reachPercent,
            topTag: maxTag,
        };
    }, [selectedTagIds, tags, totalUsers]);

    // Max interested users for bar scaling
    const maxInterested = useMemo(() => {
        return Math.max(...tags.map(t => t.interestedUsers || 0), 1);
    }, [tags]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16 gap-3">
                <Loader2 className="w-5 h-5 text-near-black/40 animate-spin" />
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Scanning User Interest Maps...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center border border-dashed border-border-subtle rounded-3xl">
                <Hash size={24} className="mx-auto text-text-muted mb-3 opacity-40" />
                <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-text-muted">{error}</p>
            </div>
        );
    }

    if (tags.length === 0) {
        return (
            <div className="py-12 text-center border border-dashed border-border-subtle rounded-3xl">
                <Hash size={24} className="mx-auto text-text-muted mb-3 opacity-40" />
                <p className="text-[10px] font-serif font-bold uppercase tracking-widest text-text-muted">No tags in the registry</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-serif font-bold uppercase tracking-[0.2em] text-near-black flex items-center gap-2">
                        <TrendingUp size={14} className="text-accent-primary" />
                        Trend Tags — Audience Analysis
                    </h3>
                    <p className="text-[10px] text-text-muted mt-1">
                        Real user interest from <span className="font-bold text-near-black">{totalUsers}</span> scholars' interest maps
                    </p>
                </div>
                {selectedTagIds.size > 0 && (
                    <button 
                        onClick={clearSelection}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted hover:text-near-black uppercase tracking-widest transition-colors px-3 py-1.5 rounded-full border border-border-subtle hover:border-near-black/30"
                    >
                        <X size={10} />
                        Clear ({selectedTagIds.size})
                    </button>
                )}
            </div>

            {/* Selected Tags Stats Panel */}
            {selectedStats && (
                <div className="bg-near-black text-ivory rounded-2xl p-6 relative overflow-hidden animation-fade-in">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl -mr-12 -mt-12" />
                    
                    <div className="flex items-center gap-2 mb-5">
                        <Users size={14} className="text-accent-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Real Audience Insight</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p className="text-[9px] text-ivory/50 uppercase tracking-widest mb-1">Tags Selected</p>
                            <p className="text-2xl font-bold font-sans">{selectedStats.selectedCount}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-ivory/50 uppercase tracking-widest mb-1">Interested Users</p>
                            <p className="text-2xl font-bold font-sans text-accent-primary">{selectedStats.totalInterested}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-ivory/50 uppercase tracking-widest mb-1">Tagged Content</p>
                            <p className="text-2xl font-bold font-sans">{selectedStats.totalContent}</p>
                        </div>
                        <div>
                            <p className="text-[9px] text-ivory/50 uppercase tracking-widest mb-1">User Reach</p>
                            <p className="text-2xl font-bold font-sans text-success">{selectedStats.reachPercent}%</p>
                        </div>
                    </div>

                    {selectedStats.topTag && (
                        <div className="mt-4 pt-4 border-t border-ivory/10 flex items-center justify-between">
                            <span className="text-[10px] opacity-60">Highest Interest</span>
                            <span className="text-[10px] font-bold text-accent-primary flex items-center gap-1.5">
                                <Hash size={10} />
                                {selectedStats.topTag.name} — {selectedStats.topTag.interestedUsers} users
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Tags Grid */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-hide pr-1">
                {tags.map((tag) => {
                    const isSelected = selectedTagIds.has(tag.name);
                    const barWidth = ((tag.interestedUsers || 0) / maxInterested) * 100;

                    return (
                        <button
                            key={tag.name}
                            onClick={() => toggleTag(tag.name)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 relative overflow-hidden group ${
                                isSelected 
                                    ? 'bg-near-black text-ivory border-near-black shadow-lg scale-[1.01]' 
                                    : 'bg-surface border-border-subtle hover:border-near-black/20'
                            }`}
                        >
                            {/* Interest bar background */}
                            <div 
                                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                                    isSelected ? 'bg-accent-primary/20' : 'bg-near-black/[0.03] group-hover:bg-near-black/[0.06]'
                                }`}
                                style={{ width: `${barWidth}%` }}
                            />

                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                        isSelected ? 'bg-accent-primary text-ivory' : 'bg-near-black/5 text-text-muted'
                                    }`}>
                                        <Hash size={10} />
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-tight truncate ${
                                        isSelected ? 'text-ivory' : 'text-near-black'
                                    }`}>
                                        {tag.name}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Real user interest count */}
                                    <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${
                                        isSelected ? 'text-accent-primary' : 'text-near-black'
                                    }`}>
                                        <Users size={10} />
                                        {tag.interestedUsers || 0}
                                    </div>
                                    {/* Content usage count */}
                                    <div className={`flex items-center gap-1 text-[10px] font-mono ${
                                        isSelected ? 'text-ivory/50' : 'text-text-muted'
                                    }`}>
                                        <FileText size={9} />
                                        {tag.count || 0}
                                    </div>
                                    {isSelected && (
                                        <div className="w-4 h-4 rounded-full bg-accent-primary flex items-center justify-center animation-fade-in">
                                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer Legend */}
            <div className="flex items-center justify-between text-[9px] text-text-muted uppercase tracking-widest pt-2 border-t border-border-subtle">
                <span>{tags.length} Tags Indexed</span>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Users size={9} /> Interested Users
                    </span>
                    <span className="flex items-center gap-1">
                        <FileText size={9} /> Content Items
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TrendTagsAnalyzer;
