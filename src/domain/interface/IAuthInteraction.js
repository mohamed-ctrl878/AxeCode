/**
 * @interface IAuthInteraction
 */
export class IAuthInteraction {
    /**
     * @param {object} credentials 
     */
    async login(credentials) {
        throw new Error("Method 'login' must be implemented.");
    }

    /**
     * @param {object} userData 
     */
    async register(userData) {
        throw new Error("Method 'register' must be implemented.");
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        throw new Error("Method 'logout' must be implemented.");
    }
}
