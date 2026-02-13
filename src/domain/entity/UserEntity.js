import { BaseEntity } from './BaseEntity';

/**
 * UserEntity class for domain user data.
 */
export class UserEntity extends BaseEntity {
    /**
     * @param {object} props
     * @param {string} props.username
     * @param {string} props.email
     * @param {string} props.firstname
     * @param {string} props.lastname
     * @param {string} props.phone
     * @param {string} props.university
     * @param {MediaEntity|null} props.avatar
     */
    constructor(props = {}) {
        super(props);
        this.username = props.username;
        this.email = props.email;
        this.firstname = props.firstname;
        this.lastname = props.lastname;
        this.phone = props.phone;
        this.university = props.university;
        this.avatar = props.avatar;
    }

    /**
     * Full name of the user.
     * @returns {string}
     */
    get fullName() {
        if (!this.firstname && !this.lastname) return this.username || 'Anonymous';
        return `${this.firstname || ''} ${this.lastname || ''}`.trim();
    }

    /**
     * Display name (Full name or username).
     * @returns {string}
     */
    get displayName() {
        return this.fullName || this.username;
    }

    /**
     * Avatar URL or fallback.
     * @returns {string}
     */
    get avatarUrl() {
        return this.avatar?.url || '/default-avatar.png'; // Fallback path
    }
}
