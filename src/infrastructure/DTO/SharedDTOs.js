/**
 * Shared DTOs for common entities.
 */

export class MediaDTO {
    constructor(data = {}) {
        this.id = data.id; // {number | string}
        this.url = data.url; // {string}
        this.display_name = data.name; // {string}
        this.mime = data.mime; // {string}
        this.size = data.size; // {number}
        this.width = data.width; // {number}
        this.height = data.height; // {number}
    }
}

export class TagDTO {
    constructor(data = {}) {
        this.id = data.id || data; // {number | string}
        this.name = data.name || data; // {string}
    }
}
