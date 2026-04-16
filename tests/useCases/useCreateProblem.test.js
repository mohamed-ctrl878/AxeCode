import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateProblem } from '../../src/domain/useCase/useCreateProblem';
import { MOCK_PROBLEM_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock ProblemRepository
const mockCreate = vi.fn();
vi.mock('@infrastructure/repository/ProblemRepository', () => {
    return {
        ProblemRepository: class {
            constructor() {
                this.create = mockCreate;
            }
        }
    };
});

describe('useCreateProblem Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully create a problem', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreateProblem());

        await act(async () => {
            const data = await result.current.createProblem(MOCK_PROBLEM_DATA);
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockCreate).toHaveBeenCalledWith(MOCK_PROBLEM_DATA);
        expect(result.current.inProgress).toBe(false);
        expect(result.current.problem).toEqual(MOCK_API_RESPONSE);
    });
});
