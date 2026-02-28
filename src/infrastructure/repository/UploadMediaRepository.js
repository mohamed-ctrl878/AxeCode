import { IUploadMediaAccess } from '../../domain/interface/IUploadMediaAccess';
import { repositoryRegistry } from './RepositoryRegistry';
import { UploadMediaDTO } from '../DTO/UploadMediaDTO';
import { EntityMapper } from '../../domain/mapper/EntityMapper';

/**
 * UploadMediaRepository handling media file uploads.
 * Implements IUploadMediaAccess.
 */
export class UploadMediaRepository extends IUploadMediaAccess {
    constructor(apiClient = repositoryRegistry.apiClient) {
        super();
        this.apiClient = apiClient;
        this.endpoint = import.meta.env.VITE_API_UPLOAD;
    }

    /**
     * Uploads files and returns an array of MediaEntity.
     * @param {File | FileList | Array<File>} files 
     * @returns {Promise<import('../../domain/entity/MediaEntity').MediaEntity[]>} Array of prepared Media entities.
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

        // 1. the API call
        const results = await this.apiClient.upload(this.endpoint, formData);

        // 2. Represent the response inside the DTO
        let dtos = [];
        if (!Array.isArray(results)) {
            dtos = [new UploadMediaDTO(results)];
        } else {
            dtos = results.map(media => new UploadMediaDTO(media));
        }

        // 3. Represent from DTO to Entity and prepare it
        return dtos.map(dto => EntityMapper.toUploadMedia(dto));
    }

    /**
     * Uploads files with progress tracking and returns an array of MediaEntity.
     * @param {File | FileList | Array<File>} files 
     * @param {function} onProgress - Callback receiving integer (0-100)
     * @returns {Promise<import('../../domain/entity/MediaEntity').MediaEntity[]>} Array of prepared Media entities.
     */
    async uploadFilesWithProgress(files, onProgress) {
        this.#validateFiles(files);

        const formData = new FormData();
        const fileList = files instanceof FileList || Array.isArray(files)
            ? Array.from(files)
            : [files];

        fileList.forEach(file => {
            formData.append('files', file);
        });

        // Use the new API Client method that supports progress tracking
        const results = await this.apiClient.uploadWithProgress(this.endpoint, formData, onProgress);

        let dtos = [];
        if (!Array.isArray(results)) {
            dtos = [new UploadMediaDTO(results)];
        } else {
            dtos = results.map(media => new UploadMediaDTO(media));
        }

        return dtos.map(dto => EntityMapper.toUploadMedia(dto));
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
