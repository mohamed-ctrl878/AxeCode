import React from 'react';
import { useCommentContent } from '@domain/useCase/useCommentContent';
import { CommentHeader } from './comments/CommentHeader';
import { CommentInput } from './comments/CommentInput';
import { CommentList } from './comments/CommentList';

/**
 * InlineComments - Composite component for article/blog details.
 * Uses decomposed reusable subunits for clean architecture and better DX.
 * 
 * @param {Object} props
 * @param {string|number} props.docId - Content ID
 * @param {string} props.contentType - Type of content (article, blog)
 */
export const InlineComments = ({ docId, contentType }) => {
    const { 
        comments, 
        loading, 
        error, 
        pagination, 
        sortOrder,
        loadMore, 
        changeSortOrder,
        addComment, 
        isAddingComment 
    } = useCommentContent(docId, contentType);

    const hasMore = pagination.page < pagination.pageCount;

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Filters */}
            <div className="bento-card bg-surface-dark/50 p-6 border border-border-subtle rounded-3xl">
                <CommentHeader 
                    total={pagination.total} 
                    sortOrder={sortOrder} 
                    onSortChange={changeSortOrder} 
                />
            </div>

            {/* Content Area */}
            <div className="bento-card bg-surface p-6 border border-border-subtle rounded-3xl flex flex-col gap-8 shadow-sm">
                {/* Input Form */}
                <CommentInput 
                    onSubmit={addComment} 
                    isSubmitting={isAddingComment} 
                    className="pb-6 border-b border-border-subtle/50"
                />

                {/* List of Comments */}
                <CommentList 
                    comments={comments} 
                    loading={loading} 
                    hasMore={hasMore} 
                    onLoadMore={loadMore} 
                    className="animate-fade-in"
                />
                
                {error && (
                    <div className="bg-status-error/10 text-status-error border border-status-error/20 p-4 rounded-xl text-xs font-bold text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};
