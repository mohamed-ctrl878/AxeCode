/**
 * DTO for Event Scanner
 */
export class EventScannerRequest {
    constructor({ targetUserId, eventId }) {
        this.data = {
            users_permissions_user: parseInt(targetUserId, 10),
            event: eventId
        };
    }

    toJSON() {
        return { data: this.data };
    }
}
