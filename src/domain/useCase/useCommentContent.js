import { useState, useCallback, useEffect } from 'react';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';
import { CommentDTO } from '@infrastructure/DTO/CommentDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * useCommentContent - Domain UseCase for managing comments with pagination and sorting.
 * Supports Articles, Blogs, etc. via docId and contentType.
 * 
 * @param {string} docId 
 * @param {string} contentType 
 */
export const useCommentContent = (docId, contentType) => {
    // --- State ---
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [error, setError] = useState(null);
    const [addCommentError, setAddCommentError] = useState(null);

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0
    });

    // Sorting State: 'desc' (Latest) | 'asc' (Oldest)
    const [sortOrder, setSortOrder] = useState('desc');

    // --- Logic ---

    /**
     * Internal fetcher
     * @param {number} targetPage 
     * @param {string} targetSort 
     * @param {boolean} append - Whether to append to existing list or replace
     */
    const fetchBatch = useCallback(async (targetPage = 1, targetSort = sortOrder, append = false) => {
        if (!docId || !contentType) return;

        setLoading(true);
        setError(null);

        try {
            const rawResponse = await repositoryRegistry.sharedInteractionRepository.getComments(docId, contentType, {
                pagination: {
                    page: targetPage,
                    pageSize: pagination.pageSize
                },
                sort: [`createdAt:${targetSort}`]
            });

            const rawData = rawResponse?.data || [];
            const meta = rawResponse?.meta?.pagination || {};

            const newComments = rawData
                .map(item => new CommentDTO(item))
                .map(dto => EntityMapper.toComment(dto));

            setComments(prev => append ? [...prev, ...newComments] : newComments);
            setPagination({
                ...pagination,
                page: targetPage,
                pageCount: meta.pageCount || 1,
                total: meta.total || 0
            });
        } catch (err) {
            setError(err.message || "Failed to fetch comments");
        } finally {
            setLoading(false);
        }
    }, [docId, contentType, pagination.pageSize, sortOrder]);

    // Initial fetch or sort change
    useEffect(() => {
        fetchBatch(1, sortOrder, false);
    }, [docId, contentType, sortOrder]); // docId/contentType change also resets

    /**
     * Load next page
     */
    const loadMore = useCallback(async () => {
        if (pagination.page >= pagination.pageCount || loading) return;
        await fetchBatch(pagination.page + 1, sortOrder, true);
    }, [pagination, loading, sortOrder, fetchBatch]);

    /**
     * Toggle sort order
     * @param {'desc'|'asc'} order 
     */
    const changeSortOrder = useCallback((order) => {
        if (order === sortOrder) return;
        setSortOrder(order);
        // useEffect will trigger fetchBatch(1, order, false)
    }, [sortOrder]);

    /**
     * Add a new comment
     * @param {{ content: string }} commentPayload 
     */
    const addComment = useCallback(async (commentPayload) => {
        if (!docId || !contentType || !commentPayload.content.trim()) return false;

        setIsAddingComment(true);
        setAddCommentError(null);

        try {
            // Strapi v4 blocks format
            const payload = {
                comment: [
                    {
                        type: 'paragraph',
                        children: [{ type: 'text', text: commentPayload.content }]
                    }
                ]
            };

            await repositoryRegistry.sharedInteractionRepository.comment(docId, contentType, payload);

            // Refresh to the first page (Latest) to show user's new comment
            setSortOrder('desc');
            await fetchBatch(1, 'desc', false);
            return true;
        } catch (err) {
            setAddCommentError(err.message || "Failed to post comment");
            return false;
        } finally {
            setIsAddingComment(false);
        }
    }, [docId, contentType, fetchBatch]);

    /**
     * Refresh the comments list (Reset to page 1)
     */
    const fetchComments = useCallback(() => {
        return fetchBatch(1, sortOrder, false);
    }, [fetchBatch, sortOrder]);

    return {
        comments,
        loading,
        error,
        pagination,
        sortOrder,
        loadMore,
        changeSortOrder,
        addComment,
        isAddingComment,
        addCommentError,
        fetchComments
    };
};
