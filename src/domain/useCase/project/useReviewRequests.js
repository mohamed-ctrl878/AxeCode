import { useState, useCallback } from 'react';
import { repositoryRegistry } from '@infrastructure/repository/RepositoryRegistry';
import { EntityMapper } from '../../mapper/EntityMapper';
import { toast } from 'react-hot-toast';

export const useReviewRequests = (projectId) => {
    const [reviewRequests, setReviewRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [error, setError] = useState(null);

    const reviewRepo = repositoryRegistry.reviewRequestRepository;

    const fetchReviewRequests = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await reviewRepo.getReviewRequests(projectId);
            const entities = (data || []).map(item => EntityMapper.toReviewRequest(item)).filter(Boolean);
            setReviewRequests(entities);
        } catch (err) {
            console.error('Failed to fetch review requests:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [projectId, reviewRepo]);

    const createReviewRequest = async (data) => {
        if (!projectId) return null;
        setResolving(true);
        try {
            const response = await reviewRepo.createReviewRequest(projectId, data);
            const entity = EntityMapper.toReviewRequest(response);
            if (entity) {
                setReviewRequests(prev => [entity, ...prev]);
                toast.success('Review request submitted successfully!');
            }
            return entity;
        } catch (err) {
            console.error('Failed to create review request:', err);
            toast.error(err.message || 'Failed to submit review request');
            return null;
        } finally {
            setResolving(false);
        }
    };

    const resolveReviewRequest = async (requestId, data) => {
        if (!projectId) return false;
        setResolving(true);
        try {
            const response = await reviewRepo.resolveReviewRequest(projectId, requestId, data);
            const entity = EntityMapper.toReviewRequest(response);
            if (entity) {
                setReviewRequests(prev => prev.map(req => req.uid === requestId ? entity : req));
                toast.success(`Review successfully resolved: ${data.status}`);
            }
            return true;
        } catch (err) {
            console.error('Failed to resolve review request:', err);
            toast.error(err.message || 'Failed to resolve review');
            return false;
        } finally {
            setResolving(false);
        }
    };

    return {
        reviewRequests,
        loading,
        resolving,
        error,
        fetchReviewRequests,
        createReviewRequest,
        resolveReviewRequest
    };
};
