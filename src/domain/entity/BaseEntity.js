/**
 * BaseEntity class providing common properties for all domain models.
 * @abstract
 */
export class BaseEntity {
    /**
     * @param {object} props
     * @param {string|number} props.id - Original ID from database.
     * @param {string} props.uid - Document ID or UUID.
     * @param {Date|null} props.createdAt
     * @param {Date|null} props.updatedAt
     */
    constructor({ id, uid, createdAt, updatedAt } = {}) {
        this.id = id;
        this.uid = uid;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Checks if the entity is new (not yet saved to backend).
     * @returns {boolean}
     */
    get isNew() {
        return !this.id;
    }

    /**
     * Formats the creation date to a readable string.
     * @param {string} locale 
     * @returns {string}
     */
    getFormattedDate(locale = 'en-US') {
        if (!this.createdAt) return '';
        return this.createdAt.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Generic toJSON method to ensure clean serialization.
     */
    toJSON() {
        return { ...this };
    }
}
