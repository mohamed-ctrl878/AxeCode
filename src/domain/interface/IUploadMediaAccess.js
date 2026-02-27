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
}
