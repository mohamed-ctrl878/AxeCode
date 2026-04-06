import { fetchWrapper } from '../../core/API/fetchWrapper';
import { NotificationDTO, NotificationPreferenceDTO } from '../DTO/NotificationDTO';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1338/api';

class NotificationRepository {
    async getMyNotifications(params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const endpoint = queryParams ? `/api/notifications/mine?${queryParams}` : `/notifications/mine`;
        const url = `${BASE_URL}${endpoint}`;

        const response = await fetchWrapper(url, true, 'application/json', 'GET');

        return {
            data: Array.isArray(response.results)
                ? response.results.map(item => new NotificationDTO(item))
                : [],
            pagination: response.pagination || null
        };
    }

    async getUnreadCount() {
        const url = `${BASE_URL}/api/notifications/unread-count`;
        console.log(url);
        const response = await fetchWrapper(url, true, 'application/json', 'GET');
        return response.unreadCount || 0;
    }

    async markAsRead(documentId) {
        const url = `${BASE_URL}/api/notifications/${documentId}/read`;
        const response = await fetchWrapper(url, true, 'application/json', 'PATCH');
        return new NotificationDTO(response);
    }

    async markAllAsRead() {
        const url = `${BASE_URL}/api/notifications/read-all`;
        const response = await fetchWrapper(url, true, 'application/json', 'PATCH');
        return response.markedAsRead || 0;
    }

    async getMyPreferences() {
        const url = `${BASE_URL}/api/notification-preferences/mine`;
        const response = await fetchWrapper(url, true, 'application/json', 'GET');
        return new NotificationPreferenceDTO(response);
    }

    async updatePreferences(requestDTO) {
        const url = `${BASE_URL}/api/notification-preferences/mine`;
        const response = await fetchWrapper(url, true, 'application/json', 'PUT', requestDTO.data);
        return new NotificationPreferenceDTO(response);
    }

    async subscribeToPush(requestDTO) {
        const url = `${BASE_URL}/api/push-subscriptions/subscribe`;
        const response = await fetchWrapper(url, true, 'application/json', 'POST', requestDTO);
        return response.data;
    }

    async unsubscribeFromPush(endpoint) {
        const url = `${BASE_URL}/api/push-subscriptions/unsubscribe`;
        const response = await fetchWrapper(url, true, 'application/json', 'POST', { endpoint });
        return response.message;
    }
}

export const notificationRepository = new NotificationRepository();
