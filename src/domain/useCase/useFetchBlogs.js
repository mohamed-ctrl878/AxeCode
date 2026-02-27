import { useCallback, useState, useRef } from 'react';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { BlogDTO } from '@infrastructure/DTO/BlogDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching recommended blogs for the feed.
 * Pipeline: API → BlogDTO → EntityMapper.toBlog → BlogEntity[]
 * @returns {{ fetchBlogs: Function, blogs: BlogEntity[], loading: boolean, error: string|null, hasMore: boolean }}
 */
export const useFetchBlogs = () => {
    const repository = useRef(new RecommendationRepository()).current;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const blogsRef = useRef([]);
    const loadingRef = useRef(false);

    const fetchBlogs = useCallback(async (isInitial = true, limit = 20) => {
        if (loadingRef.current) return;

        try {
            loadingRef.current = true;
            setLoading(true);
            setError(null);

            const excludeIds = isInitial ? [] : blogsRef.current.map(b => b.uid || b.id?.toString()).filter(Boolean);

            const rawData = await repository.getBlogs(limit, excludeIds);
            const items = Array.isArray(rawData) ? rawData : [];

            let newBlogs = items
                .map(item => new BlogDTO(item))
                .map(dto => EntityMapper.toBlog(dto))
                .filter(Boolean);

            if (isInitial) {
                blogsRef.current = newBlogs;
                setBlogs(newBlogs);
            } else {
                // Hard deduplication defense
                const existingIds = new Set(blogsRef.current.map(b => b.uid || b.id));
                newBlogs = newBlogs.filter(b => !existingIds.has(b.uid || b.id));

                if (newBlogs.length > 0) {
                    blogsRef.current = [...blogsRef.current, ...newBlogs];
                    setBlogs(blogsRef.current);
                }
            }

            setHasMore(items.length === limit); // Use raw items length to judge hasMore, not deduplicated

        } catch (err) {
            setError(err.message || 'Failed to fetch blogs');
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, []); // Stable identity

    return {
        fetchBlogs,
        blogs,
        loading,
        error,
        hasMore
    };
};
