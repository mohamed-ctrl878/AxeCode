import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { SubmissionRepository } from '@infrastructure/repository/SubmissionRepository';
import { SubmissionDTO } from '@infrastructure/DTO/SubmissionDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Use case: Fetch all submissions for a given problem documentId.
 */
export const useFetchProblemSubmissions = () => {
    const repository = useMemo(() => new SubmissionRepository(), []);

    const fetchLogic = useCallback(async (problemDocId) => {
        if (!problemDocId) throw new Error("Problem documentId is required.");

        const response = await repository.getUserSubmissions(problemDocId);
        const dataArray = response?.data || [];

        return dataArray.map(item => {
            const dto = new SubmissionDTO(item);
            return EntityMapper.toSubmission(dto);
        });
    }, [repository]);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchSubmissions: execute,
        submissions: returnedData || [],
        loadingSubmissions: inProgress,
        errorSubmissions: error
    };
};
