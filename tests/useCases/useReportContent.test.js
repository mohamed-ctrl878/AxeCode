import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReportContent } from '../../src/domain/useCase/useReportContent';

// Mock RepositoryRegistry
const { mockReport } = vi.hoisted(() => ({ mockReport: vi.fn() }));
vi.mock('@infrastructure/repository/RepositoryRegistry', () => ({
    repositoryRegistry: {
        sharedInteractionRepository: {
            report: mockReport
        }
    }
}));

describe('useReportContent Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully report content', async () => {
        mockReport.mockResolvedValue({ id: 123 });

        const { result } = renderHook(() => useReportContent());

        await act(async () => {
            const res = await result.current.reportContent('doc-1', 'api::article.article', { reason: 'spam' });
            expect(res.id).toBe(123);
        });

        expect(mockReport).toHaveBeenCalledWith('doc-1', 'api::article.article', { reason: 'spam' });
        expect(result.current.isReporting).toBe(false);
    });

    it('should handle reporting error', async () => {
        mockReport.mockRejectedValue(new Error('Failed to report'));

        const { result } = renderHook(() => useReportContent());

        await act(async () => {
            try {
                await result.current.reportContent('doc-1', 'api::article.article', {});
            } catch (e) {
                // Expected
            }
        });

        expect(result.current.reportError).toBe('Failed to report');
    });
});
