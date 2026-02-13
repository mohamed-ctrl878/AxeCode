import { UserDTO } from './UserDTO';

export class SpeakerDTO {
    constructor(data = {}) {
        this.id = data.id; // {number | string}
        this.documentId = data.documentId; // {string}
        this.title = data.title; // {string}
        this.name = data.name; // {string}
        this.linkedin = data.linkedin; // {string}
        
        /**
         * Relationships
         */
        this.event = data.event; // {object | EventDTO}
        this.userId = data.userId; // {number}
    }
}
