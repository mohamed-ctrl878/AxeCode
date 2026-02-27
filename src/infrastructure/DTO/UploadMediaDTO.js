/**
 * DTO for Uploaded Media Response.
 */
export class UploadMediaDTO {
    /**
     * @param {object} data Raw API response object for a single media item
     */
    constructor(data) {
        if (!data) return;
        this.id = data.id;
        this.documentId = data.documentId;
        this.name = data.name;
        this.alternativeText = data.alternativeText;
        this.caption = data.caption;
        this.width = data.width;
        this.height = data.height;
        this.formats = data.formats;
        this.hash = data.hash;
        this.ext = data.ext;
        this.mime = data.mime;
        this.size = data.size;
        this.url = data.url;
        this.previewUrl = data.previewUrl;
        this.provider = data.provider;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}
