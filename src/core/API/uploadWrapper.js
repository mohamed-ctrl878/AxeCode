/**
 * A shared XMLHttpRequest wrapper specifically for tracking file upload progress.
 * Needed because fetch API doesn't natively support upload progress well.
 * 
 * @param {string} url - Target URL
 * @param {boolean} useToken - Whether to include credentials
 * @param {FormData} formData - Data to be uploaded
 * @param {function} onProgress - Callback function that receives the integer progress percentage (0-100)
 * @returns {Promise<any>}
 */
export const uploadWrapper = (url, useToken = true, formData, onProgress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        if (useToken) {
            xhr.withCredentials = true;
        }

        // Track progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve(xhr.responseText);
                }
            } else {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    reject(new Error(errorData.message || `Upload failed with status ${xhr.status}`));
                } catch (e) {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            }
        };

        xhr.onerror = () => {
            reject(new Error('Network error during upload'));
        };

        xhr.send(formData);
    });
};
