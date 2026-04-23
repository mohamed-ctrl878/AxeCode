import { useAsyncUseCase } from './useAsyncUseCase';
import { CategorizationRepository } from '../../infrastructure/repository/CategorizationRepository';
import { useMemo, useEffect, useCallback, useState } from 'react';

/**
 * Hook for managing Course Types and Problem Types in Admin CMS.
 * Each type maintains its own independent pagination state.
 */
export const useFetchAdminCategorizations = () => {
    const repository = useMemo(() => new CategorizationRepository(), []);
    const pageSize = 10;

    // Course Types pagination state
    const [courseTypePage, setCourseTypePage] = useState(1);
    const [courseTypeSearch, setCourseTypeSearch] = useState('');

    // Problem Types pagination state
    const [problemTypePage, setProblemTypePage] = useState(1);
    const [problemTypeSearch, setProblemTypeSearch] = useState('');

    // Course Types
    const fetchCourseTypes = useCallback(async () => {
        return await repository.getCourseTypes(courseTypePage, pageSize, courseTypeSearch);
    }, [repository, courseTypePage, courseTypeSearch]);

    const { execute: loadCourseTypes, returnedData: courseTypesData, inProgress: isLoadingCourses, error: courseError } = useAsyncUseCase(fetchCourseTypes);

    // Problem Types
    const fetchProblemTypes = useCallback(async () => {
        return await repository.getProblemTypes(problemTypePage, pageSize, problemTypeSearch);
    }, [repository, problemTypePage, problemTypeSearch]);

    const { execute: loadProblemTypes, returnedData: problemTypesData, inProgress: isLoadingProblems, error: problemError } = useAsyncUseCase(fetchProblemTypes);

    useEffect(() => {
        loadCourseTypes();
    }, [loadCourseTypes]);

    useEffect(() => {
        loadProblemTypes();
    }, [loadProblemTypes]);

    const deleteCourseType = useCallback(async (id) => {
        await repository.deleteCourseType(id);
        await loadCourseTypes();
    }, [repository, loadCourseTypes]);

    const deleteProblemType = useCallback(async (id) => {
        await repository.deleteProblemType(id);
        await loadProblemTypes();
    }, [repository, loadProblemTypes]);

    return {
        // Course Types
        courseTypes: courseTypesData?.items || [],
        courseTypesTotalItems: courseTypesData?.meta?.pagination?.total || 0,
        courseTypesTotalPages: Math.max(1, Math.ceil((courseTypesData?.meta?.pagination?.total || 0) / pageSize)),
        courseTypesPage: courseTypePage,
        setCourseTypePage,
        setCourseTypeSearch,
        reloadCourseTypes: loadCourseTypes,
        deleteCourseType,

        // Problem Types
        problemTypes: problemTypesData?.items || [],
        problemTypesTotalItems: problemTypesData?.meta?.pagination?.total || 0,
        problemTypesTotalPages: Math.max(1, Math.ceil((problemTypesData?.meta?.pagination?.total || 0) / pageSize)),
        problemTypesPage: problemTypePage,
        setProblemTypePage,
        setProblemTypeSearch,
        reloadProblemTypes: loadProblemTypes,
        deleteProblemType,

        // Shared
        isLoading: isLoadingCourses || isLoadingProblems,
        error: courseError || problemError
    };
};
