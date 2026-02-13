import { BaseContentDTO } from './BaseContentDTO';
import { MediaDTO } from './SharedDTOs';
import { UserDTO } from './UserDTO';
import { SpeakerDTO } from './SpeakerDTO';
import { EventActivityDTO } from './EventActivityDTO';
import { EntitlementDTO } from './EntitlementDTO';

export class EventDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.description = data.discription; // {object | array} - Blocks (Note: backend typo 'discription')
        this.images = new Map(); // {Map<string | number, MediaDTO>}
        if (Array.isArray(data.image)) {
            data.image.forEach(img => this.images.set(img.id, new MediaDTO(img)));
        }
        
        this.date = data.date ? new Date(data.date) : null; // {Date | null}
        this.onsite = !!data.onsite; // {boolean}
        this.live_streaming = !!data.live_streaming; // {boolean}
        this.location = data.location; // {string}
        this.duration = data.duration; // {number} - Minutes
        this.price = data.price; // {number | null}
        this.studentCount = data.student_count || 0; // {number}
        this.hasAccess = data.hasAccess || false; // {boolean}
        this.entitlementsId = data.entitlementsId; // {string | null}

        // Detailed Entitlement
        this.entitlement = data.entitlement ? new EntitlementDTO(data.entitlement) : null; // {EntitlementDTO | null}

        /**
         * Relationships
         */
        this.speakers = new Map(); // {Map<string | number, SpeakerDTO>}
        if (Array.isArray(data.speakers)) {
            data.speakers.forEach(speaker => this.speakers.set(speaker.id, new SpeakerDTO(speaker)));
        }

        this.event_activities = new Map(); // {Map<string | number, EventActivityDTO>}
        if (Array.isArray(data.event_activities)) {
            data.event_activities.forEach(activity => this.event_activities.set(activity.id, new EventActivityDTO(activity)));
        }

        this.organizer = data.users_permissions_user ? new UserDTO(data.users_permissions_user) : null; // {UserDTO | null}

        this.scanners = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.scanners)) {
            data.scanners.forEach(scanner => this.scanners.set(scanner.id, scanner));
        }
    }
}
