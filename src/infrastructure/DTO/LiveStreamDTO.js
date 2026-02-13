import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

export class LiveStreamDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.description = data.description; // {string}
        this.status = data.status || 'scheduled'; // {string} - Enum: scheduled, live, ended, cancelled
        this.playbackUrl = data.playbackUrl; // {string}
        this.thumbnailUrl = data.thumbnailUrl; // {string}
        this.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null; // {Date | null}
        this.startedAt = data.startedAt ? new Date(data.startedAt) : null; // {Date | null}
        this.endedAt = data.endedAt ? new Date(data.endedAt) : null; // {Date | null}
        this.viewerCount = data.viewerCount || 0; // {number}
        this.peakViewers = data.peakViewers || 0; // {number}
        this.category = data.category; // {string}
        this.isRecorded = !!data.isRecorded; // {boolean}
        this.recordingUrl = data.recordingUrl; // {string}

        /**
         * Relationships
         */
        this.host = data.host ? new UserDTO(data.host) : null; // {UserDTO | null}
    }
}
