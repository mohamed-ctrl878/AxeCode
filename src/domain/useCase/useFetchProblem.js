import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { ProblemDTO } from '@infrastructure/DTO/ProblemDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single problem by ID.
 */
export const useFetchProblem = () => {
    const repository = useMemo(() => new ProblemRepository(), []);

    const fetchLogic = useCallback(async (id) => {
        if (!id) throw new Error("Problem ID is required");

        const data = await repository.getById(id);

        if (!data) {
            throw new Error("Problem not found");
        }

        const dto = new ProblemDTO(data);
        return EntityMapper.toProblem(dto);
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchProblem: execute,
        problem: returnedData,
        loading: inProgress,
        error
    };
};
