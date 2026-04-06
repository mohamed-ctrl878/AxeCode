/**
 * INotificationAccess
 * Interface defining access contracts for notifications
 */
export class INotificationAccess {
    /**
     * @returns {Promise<Array>} Array of NotificationEntity
     */
    async getMyNotifications(params) { throw new Error('Not implemented'); }
    
    async getUnreadCount() { throw new Error('Not implemented'); }
    async markAsRead(id) { throw new Error('Not implemented'); }
    async markAllAsRead() { throw new Error('Not implemented'); }
    async getPreferences() { throw new Error('Not implemented'); }
    async updatePreferences(topics) { throw new Error('Not implemented'); }
}
