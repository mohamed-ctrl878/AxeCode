import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateEvent } from '../../src/domain/useCase/useCreateEvent';
import { MOCK_EVENT_DATA, MOCK_API_RESPONSE } from './mockData';

// Mock EventRepository
const mockCreate = vi.fn();
vi.mock('@infrastructure/repository/EventRepository', () => {
    return {
        EventRepository: class {
            constructor() {
                this.create = mockCreate;
            }
        }
    };
});

describe('useCreateEvent Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully create an event', async () => {
        mockCreate.mockResolvedValue(MOCK_API_RESPONSE);

        const { result } = renderHook(() => useCreateEvent());

        await act(async () => {
            const data = await result.current.createEvent(MOCK_EVENT_DATA);
            expect(data).toEqual(MOCK_API_RESPONSE);
        });

        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining(MOCK_EVENT_DATA));
        expect(result.current.inProgress).toBe(false);
        expect(result.current.event).toBeUndefined(); // Assuming it might not be mapped to event
    });
});
