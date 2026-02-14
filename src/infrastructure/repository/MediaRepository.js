import { repositoryRegistry } from './RepositoryRegistry';

/**
 * MediaRepository handling technical file uploads.
 * Depends on IApiClient (abstracted technical layer).
 */
export class MediaRepository {
    constructor(apiClient = repositoryRegistry.apiClient) {
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_UPLOAD;
    }

    /**
     * Uploads files and returns an array of their IDs.
     * @param {File | FileList | Array<File>} files 
     * @returns {Promise<number[]>} Array of uploaded media IDs.
     */
    async uploadFiles(files) {
        this.#validateFiles(files);

        const formData = new FormData();
        const fileList = files instanceof FileList || Array.isArray(files) 
            ? Array.from(files) 
            : [files];

        fileList.forEach(file => {
            formData.append('files', file);
        });

        const results = await this.apiClient.upload(this.endpoint, formData);

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
