import { BaseEntity } from './BaseEntity';

/**
 * MediaEntity class for handling images, videos, and files.
 */
export class MediaEntity extends BaseEntity {
    /**
     * @param {object} props
     * @param {string} props.url
     * @param {string} props.name
     * @param {string} props.mime
     * @param {number} props.size
     * @param {number} props.width
     * @param {number} props.height
     */
    constructor(props = {}) {
        super(props);
        this.url = props.url;
        this.name = props.name;
        this.mime = props.mime;
        this.size = props.size;
        this.width = props.width;
        this.height = props.height;
    }

    /**
     * Checks if the media is an image.
     * @returns {boolean}
     */
    get isImage() {
        return this.mime?.startsWith('image/');
    }

    /**
     * Checks if the media is a video.
     * @returns {boolean}
     */
    get isVideo() {
        return this.mime?.startsWith('video/');
    }

    /**
     * Formatted size (e.g., 2.5 MB).
     * @returns {string}
     */
    get displaySize() {
        if (!this.size) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = this.size;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
}
