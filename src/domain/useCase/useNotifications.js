import { useState, useCallback } from 'react';
import { notificationRepository } from '@infrastructure/repository/NotificationRepository';
import { EntityMapper } from '../mapper/EntityMapper';
import { useAsyncUseCase } from './useAsyncUseCase';

/**
 * useNotifications UseCase
 * Manages fetching state, and executing notification related actions
 */
export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { execute, isLoading, error } = useAsyncUseCase();

    const fetchNotifications = useCallback(async (params = {}) => {
        const { data } = await notificationRepository.getMyNotifications(params);
        const entities = data.map(dto => EntityMapper.toNotification(dto));
        setNotifications(entities);
        return entities;
        // return execute(async () => {
        // });
    }, [execute]);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationRepository.getUnreadCount();
            setUnreadCount(count);
            return count;
        } catch (e) {
            console.error('Failed to fetch unread count', e);
            return 0;
        }
    }, []);

    const markAsRead = useCallback(async (documentId) => {
        try {
            await notificationRepository.markAsRead(documentId);
            setNotifications(prev => prev.map(n => n.uid === documentId ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error('Failed to mark notification as read', e);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationRepository.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error('Failed to mark all as read', e);
        }
    }, []);

    const pushRealTimeNotification = useCallback((rawPayload) => {
        const mockDto = {
            documentId: `rt_${Date.now()}`, 
            type: rawPayload.interactionType,
            contentType: rawPayload.contentType,
            contentDocId: rawPayload.contentDocId,
            messageAr: rawPayload.message?.ar || rawPayload.body, // Handling WebPush formats if fallback
            messageEn: rawPayload.message?.en || rawPayload.title,
            actionUrl: rawPayload.actionUrl || rawPayload.url,
            extra: rawPayload.extra,
            read: false,
            createdAt: new Date(),
            actor: rawPayload.actor
        };
        const entity = EntityMapper.toNotification(mockDto);
        setNotifications(prev => [entity, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        pushRealTimeNotification
    };
};
