import React, { useState } from 'react';
import { cn } from '@core/utils/cn';

/**
 * ArticleMetaEditor - UI for editing the article title and tags.
 * Pure presentational component with local ephemeral layout state (tagInput).
 *
 * @param {{ title: string, onTitleChange: Function, tags: string[], onAddTag: Function, onRemoveTag: Function, isDraft: boolean, onDraftChange: Function }} props
 */
export const ArticleMetaEditor = ({ title, onTitleChange, tags, onAddTag, onRemoveTag, isDraft, onDraftChange }) => {
    const [tagInput, setTagInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            onAddTag(tagInput.trim());
            setTagInput('');
        }
    };

    return (
        <div className="bento-card p-6 flex flex-col gap-6">
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Article Title..."
                    className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-text-muted/30"
                />
            </div>

            {/* Publication Status Toggle */}
            <div className="flex items-center gap-4 py-2 px-1 border-y border-border-subtle/50">
                <div 
                    onClick={() => onDraftChange(!isDraft)}
                    className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all cursor-pointer select-none",
                        isDraft 
                            ? "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-sm"
                            : "bg-surface-sunken border-border-subtle text-text-muted" 
                    )}
                >
                    <div className={cn(
                        "w-8 h-4 rounded-full relative transition-all shadow-inner",
                        isDraft ? "bg-accent-primary" : "bg-text-muted/20"
                    )}>
                        <div className={cn(
                            "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                            isDraft ? "left-4.5" : "left-0.5"
                        )} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {isDraft ? 'Draft Mode' : 'Live / Published'}
                    </span>
                </div>
                <p className="text-[10px] italic text-text-muted opacity-50">
                    {isDraft ? "Visible only in your private manuscript collection." : "Available for all scholars to read."}
                </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
                <label className="text-xs font-mono tracking-widest uppercase text-text-muted">Tags</label>
                <div className="flex flex-wrap gap-2 items-center">
                    {tags.map(tag => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-surface-dark border border-border-subtle rounded-full text-xs font-mono flex items-center gap-2"
                        >
                            #{tag}
                            <button
                                onClick={() => onRemoveTag(tag)}
                                className="text-text-muted hover:text-status-error"
                                aria-label={`Remove tag ${tag}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add tag and press Enter"
                        className="bg-transparent text-sm focus:outline-none min-w-[150px]"
                    />
                </div>
            </div>
        </div>
    );
};
