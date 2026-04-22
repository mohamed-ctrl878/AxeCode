import { useAsyncUseCase } from './useAsyncUseCase';
import { CategorizationRepository } from '../../infrastructure/repository/CategorizationRepository';
import { useMemo, useEffect } from 'react';

/**
 * UseCase for fetching course types and problem types.
 */
export const useFetchCategorizations = () => {
    const repository = useMemo(() => new CategorizationRepository(), []);

    const { execute: fetchCourseTypes, returnedData: courseTypesData, inProgress: isLoadingCourseTypes } = useAsyncUseCase(
        () => repository.getCourseTypes(1, 100)
    );

    const { execute: fetchProblemTypes, returnedData: problemTypesData, inProgress: isLoadingProblemTypes } = useAsyncUseCase(
        () => repository.getProblemTypes(1, 100)
    );

    // Fetch on mount
    useEffect(() => {
        fetchCourseTypes();
        fetchProblemTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        courseTypes: courseTypesData?.items || [],
        problemTypes: problemTypesData?.items || [],
        isLoading: isLoadingCourseTypes || isLoadingProblemTypes
    };
};
