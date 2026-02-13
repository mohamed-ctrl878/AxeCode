import { IAccess } from './IAccess';

/**
 * @interface IUserAccess
 * @extends IAccess
 */
export class IUserAccess extends IAccess {
    /**
     * @returns {Promise<UserDTO>}
     */
    async me() {
        throw new Error("Method 'me' must be implemented.");
    }

    /**
     * @param {string} role 
     * @returns {Promise<UserDTO[]>}
     */
    async findByRole(role) {
        throw new Error("Method 'findByRole' must be implemented.");
    }
}
