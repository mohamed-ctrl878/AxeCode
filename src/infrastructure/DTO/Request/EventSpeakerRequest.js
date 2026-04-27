/**
 * DTO for Event Speaker
 */
export class EventSpeakerRequest {
    constructor({ title, name, eventId, userId, linkedin }) {
        this.data = {
            title,
            name,
            event: eventId,
            userId: userId ? parseInt(userId, 10) : null,
            linkedin: linkedin || null
        };
    }

    toJSON() {
        return { data: this.data };
    }
}
