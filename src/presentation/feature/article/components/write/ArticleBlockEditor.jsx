import React from 'react';
import { GripVertical, Trash2, FileText, Share2 } from 'lucide-react';
import { RichTextInput } from '@presentation/shared/components/RichTextEditor/RichTextInput';
import { FlowBuilder } from '@presentation/shared/components/flow/FlowBuilder';

/**
 * ArticleBlockEditor - Renders the stack of content blocks (text/flow) and the "Add Block" toolbar.
 * Pure presentational (SRP & DRY applied).
 *
 * @param {{ blocks: Array, onAddBlock: Function, onUpdateBlock: Function, onRemoveBlock: Function }} props
 */
export const ArticleBlockEditor = ({ blocks, onAddBlock, onUpdateBlock, onRemoveBlock }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">
                    Content Builder
                </h3>
            </div>

            {blocks.map((block, index) => (
                <div key={block.id} className="relative group flex gap-3 w-full animate-slide-up">
                    {/* Block Controls / Drag Handle */}
                    <div className="flex flex-col items-center gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 shrink-0">
                        <span className="text-text-muted text-xs font-mono">{index + 1}</span>
                        <div className="cursor-grab hover:text-accent-primary text-text-muted">
                            <GripVertical size={16} />
                        </div>
                        <button
                            onClick={() => onRemoveBlock(block.id)}
                            className="text-text-muted hover:text-status-error transition-colors mt-auto mb-4"
                            title="Remove Block"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {/* Block Content Canvas */}
                    <div className="flex-1 bento-card overflow-hidden border-2 border-transparent transition-colors focus-within:border-accent-primary/20">
                        {block.type === 'text' ? (
                            <div className="p-2">
                                <RichTextInput
                                    value={block.data}
                                    onChange={(val) => onUpdateBlock(block.id, val)}
                                    placeholder="Start writing..."
                                    className="border-none shadow-none"
                                />
                            </div>
                        ) : (
                            <div className="h-[600px] w-full bg-surface-dark">
                                <div className="p-3 bg-surface border-b border-border-subtle flex items-center justify-between">
                                    <span className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-2">
                                        <Share2 size={12} /> Flowchart Editor
                                    </span>
                                </div>
                                <FlowBuilder
                                    initialNodes={block.data?.nodes || []}
                                    initialEdges={block.data?.edges || []}
                                    onSave={(flowData) => onUpdateBlock(block.id, flowData)}
                                    className="h-full border-none rounded-none"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add Block Toolbar */}
            <div className="w-full max-w-2xl mx-auto flex items-center justify-center gap-4 mt-8 py-6 border border-dashed border-border-subtle rounded-2xl bg-surface-light border-accent-primary/20 hover:border-accent-primary/50 transition-colors">
                <button
                    onClick={() => onAddBlock('text')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-subtle text-sm font-bold hover:bg-background hover:border-accent-primary transition-all shadow-sm"
                >
                    <FileText size={16} className="text-accent-primary" /> Add Text Block
                </button>
                <button
                    onClick={() => onAddBlock('flow')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-subtle text-sm font-bold hover:bg-background hover:text-purple-400 hover:border-purple-400 transition-all shadow-sm"
                >
                    <Share2 size={16} className="text-purple-400" /> Add Diagram/Flow
                </button>
            </div>
        </div>
    );
};
