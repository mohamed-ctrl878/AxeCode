import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUploadMedia } from '../useUploadMedia';
import { MediaRepository } from '../../../infrastructure/repository/MediaRepository';

const mockUploadFiles = vi.fn();

vi.mock('../../../infrastructure/repository/MediaRepository', () => {
    return {
        MediaRepository: vi.fn().mockImplementation(function () {
            return {
                uploadFiles: mockUploadFiles
            };
        })
    };
});

describe('useUploadMedia Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle successful media upload', async () => {
        const mockFile = new File([''], 'test.png', { type: 'image/png' });
        const mockIds = [1, 2, 3];
        mockUploadFiles.mockResolvedValue(mockIds);

        const { result } = renderHook(() => useUploadMedia());

        await act(async () => {
            await result.current.upload(mockFile);
        });

        expect(result.current.inProgress).toBe(false);
        expect(result.current.uploadedIds).toEqual(mockIds);
    });
});
