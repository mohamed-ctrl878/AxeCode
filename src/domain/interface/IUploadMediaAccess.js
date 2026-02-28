import { IAccess } from './IAccess';

/**
 * @interface IUploadMediaAccess
 * @extends IAccess
 */
export class IUploadMediaAccess extends IAccess {
    /**
     * Uploads media files.
     * @param {File | FileList | Array<File>} files 
     * @returns {Promise<any>}
     */
    async uploadFiles(files) {
        throw new Error("Method 'uploadFiles' must be implemented.");
    }

    /**
     * Uploads media files while tracking progress.
     * @param {File | FileList | Array<File>} files 
     * @param {function} onProgress - Callback function receiving integer progress (0-100)
     * @returns {Promise<any>}
     */
    async uploadFilesWithProgress(files, onProgress) {
        throw new Error("Method 'uploadFilesWithProgress' must be implemented.");
    }
}
