export class EventActivityDTO {
    constructor(data = {}) {
        this.id = data.id; // {number | string}
        this.title = data.title; // {string}
        this.description = data.description; // {object | array} - Blocks
        this.time = data.time ? new Date(data.time) : null; // {Date | null}
    }
}
