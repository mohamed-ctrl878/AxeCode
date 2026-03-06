import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useCommentContent } from '@domain/useCase/useCommentContent';
import { CommentHeader } from './comments/CommentHeader';
import { CommentInput } from './comments/CommentInput';
import { CommentList } from './comments/CommentList';

/**
 * CommentModal - Modal compositor for feed interactions.
 * Unified with InlineComments using the same reusable subunits.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string|number} props.docId
 * @param {string} props.contentType
 * @param {string} props.contentTitle
 */
export const CommentModal = ({ 
    isOpen, 
    onClose, 
    docId, 
    contentType, 
    contentTitle = 'Content'
}) => {
    const { 
        comments, 
        loading, 
        error, 
        pagination, 
        sortOrder,
        loadMore, 
        changeSortOrder,
        addComment, 
        isAddingComment,
        fetchComments 
    } = useCommentContent(docId, contentType);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, fetchComments]);

    if (!isOpen) return null;

    const hasMore = pagination.page < pagination.pageCount;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-surface border border-border-subtle rounded-[32px] w-full max-w-2xl shadow-2xl flex flex-col h-[85vh] max-h-[700px] animate-zoom-in overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0 bg-surface-dark/30">
                    <CommentHeader 
                        total={pagination.total} 
                        sortOrder={sortOrder} 
                        onSortChange={changeSortOrder} 
                        className="flex-1"
                    />
                    <button 
                        onClick={onClose}
                        className="p-2.5 ml-4 bg-surface rounded-full border border-border-subtle hover:bg-surface-light text-text-muted hover:text-text-primary transition-all hover:scale-110"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-surface-light/10 custom-scrollbar">
                    {/* Input Form at Top */}
                    <div className="p-4 bg-surface border border-border-subtle rounded-2xl shadow-sm">
                        <CommentInput 
                            onSubmit={addComment} 
                            isSubmitting={isAddingComment} 
                            placeholder={`Reply to "${contentTitle}"...`}
                        />
                    </div>

                    {/* Comments List */}
                    <CommentList 
                        comments={comments} 
                        loading={loading} 
                        hasMore={hasMore} 
                        onLoadMore={loadMore} 
                    />

                    {error && (
                        <div className="bg-status-error/10 text-status-error border border-status-error/20 p-4 rounded-xl text-xs font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Modal Footer (Sticky status) */}
                <div className="p-4 border-t border-border-subtle shrink-0 bg-surface text-center">
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                        AxeCode • Standard Interaction Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};
