import React, { useState } from 'react';

/**
 * ArticleMetaEditor - UI for editing the article title and tags.
 * Pure presentational component with local ephemeral layout state (tagInput).
 *
 * @param {{ title: string, onTitleChange: Function, tags: string[], onAddTag: Function, onRemoveTag: Function }} props
 */
export const ArticleMetaEditor = ({ title, onTitleChange, tags, onAddTag, onRemoveTag }) => {
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
