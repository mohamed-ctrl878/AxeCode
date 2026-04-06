export class UpdateNotificationPreferenceRequest {
    constructor(data = {}) {
        this.data = {
            disabled_topics: Array.isArray(data.disabledTopics) ? data.disabledTopics : []
        };
    }
}

export class PushSubscriptionRequest {
    constructor(data = {}) {
        this.endpoint = data.endpoint;
        this.keys = {
            p256dh: data.p256dh,
            auth: data.auth
        };
        this.browser_type = data.browserType || 'unknown';
    }
}
