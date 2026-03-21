import { useAsyncUseCase } from './useAsyncUseCase';
import { CategorizationRepository } from '../../infrastructure/repository/CategorizationRepository';
import { useMemo, useEffect } from 'react';

/**
 * UseCase for fetching course types and problem types.
 */
export const useFetchCategorizations = () => {
    const repository = useMemo(() => new CategorizationRepository(), []);

    const { execute: fetchCourseTypes, returnedData: courseTypes, inProgress: isLoadingCourseTypes } = useAsyncUseCase(
        () => repository.getCourseTypes()
    );

    const { execute: fetchProblemTypes, returnedData: problemTypes, inProgress: isLoadingProblemTypes } = useAsyncUseCase(
        () => repository.getProblemTypes()
    );

    // Fetch on mount
    useEffect(() => {
        fetchCourseTypes();
        fetchProblemTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        courseTypes: courseTypes || [],
        problemTypes: problemTypes || [],
        isLoading: isLoadingCourseTypes || isLoadingProblemTypes
    };
};
