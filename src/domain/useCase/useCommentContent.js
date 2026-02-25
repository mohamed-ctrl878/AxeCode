import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { repositoryRegistry } from '../../infrastructure/repository/RepositoryRegistry';
import { CommentDTO } from '@infrastructure/DTO/CommentDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

export const useCommentContent = (docId, contentType) => {
    // Fetching comments
    const fetchCommentsLogic = useCallback(async () => {
        if (!docId || !contentType) return [];
        const rawResponse = await repositoryRegistry.sharedInteractionRepository.getComments(docId, contentType);
        const items = Array.isArray(rawResponse?.data) ? rawResponse.data : (Array.isArray(rawResponse) ? rawResponse : []);

        return items
            .map(item => new CommentDTO(item))
            .map(dto => EntityMapper.toComment(dto))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
    }, [docId, contentType]);

    const {
        execute: fetchComments,
        inProgress: isFetchingComments,
        error: fetchCommentsError,
        returnedData: comments
    } = useAsyncUseCase(fetchCommentsLogic);

    // Adding a comment
    const addCommentLogic = useCallback(async (commentTextPayload) => {
        // Strapi v4 requires Richtext blocks format for `comment` field
        const payload = {
            comment: [
                {
                    type: 'paragraph',
                    children: [{ type: 'text', text: commentTextPayload.content }]
                }
            ]
        };
        const response = await repositoryRegistry.sharedInteractionRepository.comment(docId, contentType, payload);
        // Refresh the list immediately after adding
        await fetchComments();
        return response;
    }, [docId, contentType, fetchComments]);

    const {
        execute: addComment,
        inProgress: isAddingComment,
        error: addCommentError
    } = useAsyncUseCase(addCommentLogic);

    return {
        comments: comments || [],
        loading: isFetchingComments,
        error: fetchCommentsError,
        addComment,
        isAddingComment,
        addCommentError,
        fetchComments
    };
};
