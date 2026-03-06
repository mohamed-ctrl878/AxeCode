import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { SubmissionRepository } from '@infrastructure/repository/SubmissionRepository';

/**
 * UseCase for submitting code for full judging (persisted submission).
 * Pipeline: UI state → SubmissionRepository.submit() → Poll for result.
 *
 * @returns {{ submitCode: Function, result: object|null, submitting: boolean, error: string|null }}
 */
export const useSubmitCode = () => {
    const repository = new SubmissionRepository();

    const submitLogic = useCallback(async ({ problemId, code, language }) => {
        if (!problemId || !code?.trim() || !language) {
            throw new Error("Problem ID, code, and language are required.");
        }

        // 1. Submit for full judging
        const response = await repository.submit({ problemId, code, language });
        const submission = response?.data || response;

        if (!submission?.documentId) {
            throw new Error("Failed to initiate submission.");
        }

        // 2. Poll for result (async judge pipeline)
        const result = await pollForResult(repository, submission.documentId);
        return result;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(submitLogic);

    return {
        submitCode: execute,
        result: returnedData,
        submitting: inProgress,
        error
    };
};

/**
 * Polls the submission endpoint until verdict is no longer 'pending'.
 * @param {SubmissionRepository} repository
 * @param {string} submissionId
 * @param {number} maxAttempts
 * @returns {Promise<object>}
 */
async function pollForResult(repository, submissionId, maxAttempts = 20) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const delay = Math.min((attempt + 1) * 1000, 5000);
        await new Promise(resolve => setTimeout(resolve, delay));

        const response = await repository.getResult(submissionId);
        const data = response?.data || response;

        if (data?.verdict && data.verdict !== 'pending') {
            return {
                verdict: data.verdict,
                executionTime: data.executionTime,
                memoryUsed: data.memoryUsed,
                testCasesPassed: data.testCasesPassed,
                totalTestCases: data.totalTestCases,
                judgeOutput: data.judgeOutput
            };
        }
    }

    return {
        verdict: 'pending',
        judgeOutput: { error: 'Judging is taking longer than expected. Please check back.' }
    };
}
