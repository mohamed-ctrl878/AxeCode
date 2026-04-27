/**
 * DTO for Event Activity
 */
export class EventActivityRequest {
    constructor({ title, from, description, eventId }) {
        this.data = {
            title,
            from: this.formatTimeForStrapi(from),
            description: description || '',
            event: eventId
        };
    }

    /**
     * Converts an HH:mm string format or any raw time to Strapi's expected time format
     */
    formatTimeForStrapi(timeValue) {
        if (!timeValue) return null;
        // Strapi time is best sent as HH:mm:ss.SSS
        if (timeValue.length === 5) {
            return `${timeValue}:00.000`;
        }
        return timeValue;
    }

    toJSON() {
        return { data: this.data };
    }
}
