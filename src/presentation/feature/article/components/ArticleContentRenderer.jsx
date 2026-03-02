import React from 'react';
import { RichBlocksPreviewer } from '@presentation/shared/components/RichBlocksPreviewer';
import { FlowPreviewer } from '@presentation/shared/components/flow/FlowPreviewer';
import { Share2 } from 'lucide-react';

/**
 * ArticleContentRenderer - Iterates over content blocks and dispatches
 * to the appropriate previewer component (text → RichBlocksPreviewer, flow → FlowPreviewer).
 * Pure presentational — receives content array via props.
 *
 * @param {{ content: Array<{type: string, data: any, id?: string}> }} props
 */
export const ArticleContentRenderer = ({ content }) => {
    if (!content) return null;

    // Fallback for legacy non-array content
    if (!Array.isArray(content)) {
        return (
            <div className="bento-card p-8">
                <RichBlocksPreviewer content={content} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {content.map((block, index) => {
                if (block.type === 'text') {
                    return (
                        <div key={block.id || index} className="bento-card p-8 bg-surface-light border-transparent">
                            <RichBlocksPreviewer content={block.data} />
                        </div>
                    );
                }

                if (block.type === 'flow') {
                    return (
                        <div key={block.id || index} className="w-full h-[500px] bento-card p-2 bg-surface-dark overflow-hidden border border-border-subtle group">
                            <div className="px-4 py-3 flex justify-between items-center bg-background border-b border-border-subtle rounded-t-xl opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-mono font-bold tracking-widest uppercase text-accent-primary flex items-center gap-2">
                                    <Share2 size={14} /> Diagram Architecture
                                </span>
                            </div>
                            <FlowPreviewer
                                nodes={block.data?.nodes || []}
                                edges={block.data?.edges || []}
                                className="h-[calc(100%-45px)] rounded-b-xl border-none"
                            />
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};
