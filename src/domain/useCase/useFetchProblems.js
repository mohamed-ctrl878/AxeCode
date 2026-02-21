import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { ProblemDTO } from '@infrastructure/DTO/ProblemDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching problems list.
 * Pipeline: API → ProblemDTO → EntityMapper.toCardProblem → CardProblemEntity[]
 * @returns {{ fetchProblems: Function, problems: CardProblemEntity[]|null, loading: boolean, error: string|null }}
 */
export const useFetchProblems = () => {
    const repository = new ProblemRepository();

    const fetchLogic = useCallback(async (params = {}) => {
        const response = await repository.getAll(params);
        const rawItems = response?.data || response;
        const items = Array.isArray(rawItems) ? rawItems : [];
        return items
            .map(item => new ProblemDTO(item))
            .map(dto => EntityMapper.toCardProblem(dto))
            .filter(Boolean);
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchProblems: execute,
        problems: returnedData,
        loading: inProgress,
        error
    };
};
