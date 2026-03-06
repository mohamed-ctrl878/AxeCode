import { useCallback } from 'react';
import { useAsyncUseCase } from './useAsyncUseCase';
import { SubmissionRepository } from '@infrastructure/repository/SubmissionRepository';

/**
 * UseCase for running code against test cases (Quick Test).
 * Pipeline: UI state → SubmissionRepository.run() → Poll for result.
 *
 * @returns {{ runCode: Function, result: object|null, running: boolean, error: string|null }}
 */
export const useRunCode = () => {
    const repository = new SubmissionRepository();

    const runLogic = useCallback(async ({ problemId, code, language }) => {
        if (!problemId || !code?.trim() || !language) {
            throw new Error("Problem ID, code, and language are required.");
        }

        // 1. Submit for quick test
        const response = await repository.run({ problemId, code, language });
        const submission = response?.data || response;

        if (!submission?.documentId) {
            throw new Error("Failed to initiate test run.");
        }

        // 2. Poll for result (async judge pipeline)
        const result = await pollForResult(repository, submission.documentId);
        return result;
    }, []);

    const { execute, returnedData, inProgress, error } = useAsyncUseCase(runLogic);

    return {
        runCode: execute,
        result: returnedData,
        running: inProgress,
        error
    };
};

/**
 * Polls the submission endpoint until verdict is no longer 'pending'.
 * Uses exponential backoff: 1s → 2s → 3s → ... up to maxAttempts.
 *
 * @param {SubmissionRepository} repository
 * @param {string} submissionId
 * @param {number} maxAttempts
 * @returns {Promise<object>}
 */
async function pollForResult(repository, submissionId, maxAttempts = 15) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Wait with linear backoff (1s, 2s, 3s capped at 5s)
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

    // Timeout: return pending state
    return {
        verdict: 'pending',
        judgeOutput: { error: 'Judging is taking longer than expected. Please check back.' }
    };
}
