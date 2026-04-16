import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateUserAvatar } from '../../src/domain/useCase/useUpdateUserAvatar';
import { MOCK_USER_DATA } from './mockData';

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Mock Repositories
const mockUploadFiles = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@infrastructure/repository/MediaRepository', () => {
    return {
        MediaRepository: class {
            constructor() {
                this.uploadFiles = mockUploadFiles;
            }
        }
    };
});

vi.mock('@infrastructure/repository/UserRepository', () => {
    return {
        UserRepository: class {
            constructor() {
                this.updateUser = mockUpdateUser;
            }
        }
    };
});

// Mock EntityMapper and DTOs
vi.mock('../../domain/mapper/EntityMapper', () => ({
    EntityMapper: {
        toUser: vi.fn().mockImplementation((dto) => dto)
    }
}));

describe('useUpdateUserAvatar Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully upload and link avatar', async () => {
        const mockFile = new File([''], 'test.png', { type: 'image/png' });
        mockUploadFiles.mockResolvedValue([101]); // Mock uploaded image ID
        mockUpdateUser.mockResolvedValue({ ...MOCK_USER_DATA, avatar: { url: 'new-avatar.png' } });

        const { result } = renderHook(() => useUpdateUserAvatar());

        await act(async () => {
            const data = await result.current.updateAvatar(1, mockFile);
            expect(data.avatar.url).toContain('new-avatar.png');
        });

        expect(mockUploadFiles).toHaveBeenCalled();
        expect(mockUpdateUser).toHaveBeenCalledWith(1, expect.anything());
        expect(mockDispatch).toHaveBeenCalled();
        expect(result.current.isUpdating).toBe(false);
    });

    it('should handle upload failures', async () => {
        const mockFile = new File([''], 'test.png', { type: 'image/png' });
        mockUploadFiles.mockResolvedValue([]); // Empty response means failure

        const { result } = renderHook(() => useUpdateUserAvatar());

        await act(async () => {
            try {
                await result.current.updateAvatar(1, mockFile);
            } catch (e) {
                expect(e.message).toContain('Cloud synchronization failed');
            }
        });

        expect(mockUpdateUser).not.toHaveBeenCalled();
    });
});
