import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotifications } from '../../src/domain/useCase/useNotifications';

// Mock NotificationRepository
vi.mock('@infrastructure/repository/NotificationRepository', () => ({
    notificationRepository: {
        getMyNotifications: vi.fn(),
        getUnreadCount: vi.fn(),
        markAsRead: vi.fn(),
        markAllAsRead: vi.fn()
    }
}));

import { notificationRepository } from '@infrastructure/repository/NotificationRepository';

// Mock Mapper
vi.mock('../mapper/EntityMapper', () => ({
    EntityMapper: {
        toNotification: vi.fn().mockImplementation((dto) => ({ ...dto, mapped: true, uid: dto.documentId }))
    }
}));

describe('useNotifications Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch notifications', async () => {
        notificationRepository.getMyNotifications.mockResolvedValue({ data: [{ documentId: '1' }] });

        const { result } = renderHook(() => useNotifications());

        await act(async () => {
            const data = await result.current.fetchNotifications();
            expect(data).toHaveLength(1);
        });

        expect(result.current.notifications).toHaveLength(1);
    });

    it('should fetch unread count', async () => {
        notificationRepository.getUnreadCount.mockResolvedValue(5);

        const { result } = renderHook(() => useNotifications());

        await act(async () => {
            await result.current.fetchUnreadCount();
        });

        expect(result.current.unreadCount).toBe(5);
    });

    it('should mark single notification as read', async () => {
        notificationRepository.getMyNotifications.mockResolvedValue({ data: [{ documentId: '1', read: false }] });
        
        const { result } = renderHook(() => useNotifications());

        await act(async () => {
            await result.current.fetchNotifications();
        });

        await act(async () => {
            await result.current.markAsRead('1');
        });

        expect(notificationRepository.markAsRead).toHaveBeenCalledWith('1');
        expect(result.current.notifications[0].read).toBe(true);
    });

    it('should push real-time notification', async () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.pushRealTimeNotification({ body: 'Hello', title: 'New Alert' });
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.unreadCount).toBe(1);
        expect(result.current.notifications[0].messageEn).toBe('New Alert');
    });
});
