import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, User, Layers } from 'lucide-react';

/**
 * RoadmapCard: Displays a single roadmap in a card layout.
 * Shows color accent, title, description preview, node count, author, and tags.
 * @param {object} props
 * @param {RoadmapEntity} props.roadmap
 */
export const RoadmapCard = ({ roadmap }) => {
    const navigate = useNavigate();

    if (!roadmap) return null;

    const accentColor = roadmap.color || '#FFD700';

    /**
     * Extracts a plain text preview from rich text blocks.
     * @param {object|array|string} description
     * @returns {string}
     */
    const getDescriptionPreview = (description) => {
        if (typeof description === 'string') return description;
        if (Array.isArray(description)) {
            return description
                .flatMap(block => block?.children || [])
                .map(child => child?.text || '')
                .join(' ')
                .slice(0, 120);
        }
        return '';
    };

    const preview = getDescriptionPreview(roadmap.description);

    return (
        <div
            onClick={() => navigate(`/roadmaps/${roadmap.uid}`)}
            className="group relative bento-card bg-surface-dark border border-border-subtle rounded-2xl overflow-hidden cursor-pointer hover:border-border-subtle/80 transition-all duration-300 hover:-translate-y-1"
        >
            {/* Color Accent Bar */}
            <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
            />

            <div className="p-6 flex flex-col gap-4">
                {/* Header: Icon + Title */}
                <div className="flex items-start gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${accentColor}20` }}
                    >
                        <GitBranch size={20} style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                            {roadmap.title || 'Untitled Roadmap'}
                        </h3>
                        {roadmap.author && (
                            <div className="flex items-center gap-1.5 mt-1 text-text-muted">
                                <User size={12} />
                                <span className="text-xs font-mono">
                                    {roadmap.author.username || roadmap.author}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Preview */}
                {preview && (
                    <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                        {preview}
                    </p>
                )}

                {/* Footer: Stats + Tags */}
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                    <div className="flex items-center gap-1.5 text-text-muted">
                        <Layers size={14} />
                        <span className="text-xs font-mono">{roadmap.nodeCount} nodes</span>
                    </div>

                    {roadmap.tags?.length > 0 && (
                        <div className="flex gap-1.5 overflow-hidden max-w-[60%]">
                            {roadmap.tags.slice(0, 2).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-surface border border-border-subtle text-text-muted truncate"
                                >
                                    {typeof tag === 'string' ? tag : tag.name || ''}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
