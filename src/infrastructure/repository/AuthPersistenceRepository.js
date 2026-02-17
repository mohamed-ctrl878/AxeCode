import { IAuthAccess } from '../../domain/interface/IAuthAccess';

/**
 * AuthPersistenceRepository: Handles the persistence of authentication state.
 * Implements IAuthAccess: Follows the domain interface for session access.
 * Security Strict Rule: Only stores the authentication toggle. NO user data.
 */
const STORAGE_KEY = 'axe_auth_session';

export class AuthPersistenceRepository extends IAuthAccess {
    /**
     * Persists the authentication toggle.
     * @param {object} data - { isAuthenticated: boolean }.
     */
    async saveSession(data) {
        try {
            if (data) {
                const toggleOnly = {
                    isAuthenticated: !!data.isAuthenticated
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(toggleOnly));
            }
        } catch (error) {
            console.error("AuthPersistenceRepository: Error saving session", error);
        }
    }

    /**
     * Retrieves the persisted session info.
     * Implementation of IAuthAccess.getSessionInfo
     * @returns {Promise<object|null>}
     */
    async getSessionInfo() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;

            const parsed = JSON.parse(stored);
            return {
                isAuthenticated: !!parsed.isAuthenticated
            };
        } catch (error) {
            console.error("AuthPersistenceRepository: Error retrieving session", error);
            return null;
        }
    }

    /**
     * Clears the session from storage.
     */
    async clearSession() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("AuthPersistenceRepository: Error clearing session", error);
        }
    }

    /**
     * me: Not implemented for local persistence.
     * Required by IAuthAccess.
     */
    async me() {
        return null;
    }
}
