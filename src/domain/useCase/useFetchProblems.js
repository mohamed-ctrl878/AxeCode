import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { ProblemDTO } from '@infrastructure/DTO/ProblemDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching problems list.
 */
export const useFetchProblems = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const fetchLogic = useCallback(async (params = {}) => {
        console.log("repo", repository);
        const data = await repository.getAll(params);
        const items = Array.isArray(data) ? data : [];
        return items
            .map(item => new ProblemDTO(item))
            .map(dto => EntityMapper.toCardProblem(dto))
            .filter(Boolean);
    }, [repository]);

    const { execute: fetchProblems, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchProblems,
        problems: returnedData,
        loading: inProgress,
        error
    };
};
