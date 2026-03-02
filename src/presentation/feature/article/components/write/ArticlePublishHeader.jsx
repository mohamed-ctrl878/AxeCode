import React from 'react';
import { FileText, Share2 } from 'lucide-react';

/**
 * ArticlePublishHeader - UI for the top action bar in the editor.
 * Pure presentational component (SRP).
 *
 * @param {{ onCancel: Function, onPublish: Function, isSubmitting: boolean, isPublishDisabled: boolean }} props
 */
export const ArticlePublishHeader = ({ onCancel, onPublish, isSubmitting, isPublishDisabled }) => {
    return (
        <div className="flex justify-between items-center sticky top-24 z-20 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3">
                <FileText className="text-accent-primary" size={24} />
                <h1 className="text-xl font-bold">Write Article</h1>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onPublish}
                    disabled={isSubmitting || isPublishDisabled}
                    className="flex items-center gap-2 bg-accent-primary text-background px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                    ) : (
                        <Share2 size={16} />
                    )}
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
            </div>
        </div>
    );
};
