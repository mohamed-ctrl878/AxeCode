import { useCallback, useMemo, useState } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { TestCaseRepository } from '@infrastructure/repository/TestCaseRepository';
import { TestCaseDTO } from '@infrastructure/DTO/TestCaseDTO';
import { EntityMapper } from '@domain/mapper/EntityMapper';

/**
 * Composite UseCase hook for managing algorithmic problem test cases.
 */
export const useManageTestCases = () => {
    const repository = useMemo(() => new TestCaseRepository(), []);
    const [testCases, setTestCases] = useState([]);

    // 1. Fetch Logic
    const fetchLogic = useCallback(async (problemId) => {
        if (!problemId) return [];
        const rawData = await repository.getByProblem(problemId);
        const entities = (rawData || []).map(item => {
            const dto = new TestCaseDTO(item);
            return EntityMapper.toTestCase(dto);
        });
        setTestCases(entities);
        return entities;
    }, [repository]);

    const { execute: fetchTestCases, inProgress: loading, error: fetchError } = useAsyncUseCase(fetchLogic);

    // 2. Add Logic
    const addLogic = useCallback(async ({ problemId, data }) => {
        const result = await repository.create({ ...data, problem: problemId });
        // Refresh local state or re-fetch
        await fetchLogic(problemId);
        return result;
    }, [repository, fetchLogic]);

    const { execute: addTestCase, inProgress: adding, error: addError } = useAsyncUseCase(addLogic);

    // 3. Update Logic
    const updateLogic = useCallback(async ({ id, data, problemId }) => {
        const result = await repository.update(id, data);
        await fetchLogic(problemId);
        return result;
    }, [repository, fetchLogic]);

    const { execute: updateTestCase, inProgress: updating, error: updateError } = useAsyncUseCase(updateLogic);

    // 4. Delete Logic
    const deleteLogic = useCallback(async ({ id, problemId }) => {
        const result = await repository.delete(id);
        await fetchLogic(problemId);
        return result;
    }, [repository, fetchLogic]);

    const { execute: deleteTestCase, inProgress: deleting, error: deleteError } = useAsyncUseCase(deleteLogic);

    return {
        testCases,
        fetchTestCases,
        addTestCase,
        updateTestCase,
        deleteTestCase,
        loading,
        adding,
        updating,
        deleting,
        error: fetchError || addError || updateError || deleteError
    };
};
