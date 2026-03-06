import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { ProblemRepository } from '@infrastructure/repository/ProblemRepository';
import { ProblemDTO } from '@infrastructure/DTO/ProblemDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case for fetching a single problem by ID.
 * Pipeline: API → ProblemDTO → EntityMapper.toProblem → ProblemEntity
 *
 * @returns {{ fetchProblem: Function, problem: ProblemEntity|null, loading: boolean, error: string|null }}
 */
export const useFetchProblem = () => {
    const repository = new ProblemRepository();

    const fetchLogic = useCallback(async (id) => {
        if (!id) throw new Error("Problem ID is required");

        const rawData = await repository.getById(id);

        if (!rawData || !rawData.data) {
            throw new Error("Problem not found");
        }

        const item = rawData.data || rawData;

        // 1. Convert raw API response to structured DTO
        const dto = new ProblemDTO(item);

        // 2. Map DTO to pure Domain Entity
        const entity = EntityMapper.toProblem(dto);

        return entity;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchProblem: execute,
        problem: returnedData,
        loading: inProgress,
        error
    };
};
