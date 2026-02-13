/**
 * @interface IAuthAccess
 */
export class IAuthAccess {
    /**
     * @returns {Promise<any>}
     */
    async getSessionInfo() {
        throw new Error("Method 'getSessionInfo' must be implemented.");
    }

    /**
     * @returns {Promise<any>}
     */
    async me() {
        throw new Error("Method 'me' must be implemented.");
    }
}
