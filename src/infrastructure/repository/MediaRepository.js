import { BaseRepository } from './BaseRepository';
import { fetchWrapper } from '../../core/API/fetchWrapper';

/**
 * Repository for handling file and media uploads.
 */
export class MediaRepository extends BaseRepository {
    constructor() {
        super();
        this.endpoint = import.meta.env.VITE_API_UPLOAD;
    }

    /**
     * Uploads files and returns an array of their IDs.
     * @param {File | FileList | Array<File>} files 
     * @returns {Promise<number[]>} Array of uploaded media IDs.
     */
    async uploadFiles(files) {
        this.#validateFiles(files);

        const url = this.buildUrl(this.endpoint);
        const formData = new FormData();

        const fileList = files instanceof FileList || Array.isArray(files) 
            ? Array.from(files) 
            : [files];

        fileList.forEach(file => {
            formData.append('files', file);
        });

        const results = await fetchWrapper(url, true, null, 'POST', formData);

        // Strapi returns an array of media objects or a single object
        if (!Array.isArray(results)) {
            return [results.id].filter(id => id !== undefined);
        }

        return results.map(media => media.id);
    }

    /**
     * Internal validation for media files.
     * @private
     */
    #validateFiles(files) {
        if (!files) throw new Error("No files provided for upload.");
        
        const fileList = files instanceof FileList || Array.isArray(files) 
            ? Array.from(files) 
            : [files];

        if (fileList.length === 0) throw new Error("File list is empty.");

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        for (const file of fileList) {
            if (!(file instanceof File)) continue;
            if (file.size > MAX_SIZE) {
                throw new Error(`File ${file.name} exceeds the 10MB limit.`);
            }
        }
    }
}
