import { useAsyncUseCase } from './useAsyncUseCase';
import { CourseRepository } from '../../infrastructure/repository/CourseRepository';
import { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Domain UseCase to retrieve the list of all courses for CMS representation.
 */
export const useFetchAdminCourses = () => {
    const userId = useSelector((state) => state.auth?.user?.id);
    const repository = useMemo(() => new CourseRepository(), []);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 10; // Match what's configured in CMSResourceTable logic
    
    // Pass page, pageSize, search to repository
    const { execute, returnedData: data, inProgress: isLoading, error } = useAsyncUseCase(
        () => repository.getAll(userId, page, pageSize, search)
    );

    useEffect(() => {
        if (userId) {
            execute();
        }
    }, [userId, page, search]);

    return {
        courses: data?.items || [],
        totalItems: data?.meta?.pagination?.total || 0,
        totalPages: Math.max(1, Math.ceil((data?.meta?.pagination?.total || 0) / pageSize)),
        currentPage: page,
        setPage,
        searchQuery: search,
        setSearch,
        isLoading,
        error,
        fetch: execute
    };
};
