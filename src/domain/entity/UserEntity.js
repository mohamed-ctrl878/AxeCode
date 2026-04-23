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
     * @param {string} props.bio
     * @param {MediaEntity|null} props.avatar
     * @param {number} props.submissionCount
     * @param {number} props.passedSubmissionsCount
     * @param {boolean} props.confirmed
     * @param {boolean} props.blocked
     * @param {object} props.role
     * @param {string} props.createdAt
     */
    constructor(props = {}) {
        super(props);
        this.username = props.username;
        this.email = props.email;
        this.firstname = props.firstname;
        this.lastname = props.lastname;
        this.phone = props.phone;
        this.university = props.university;
        this.bio = props.bio;
        this.avatar = props.avatar;
        
        // Admin fields
        this.confirmed = props.confirmed;
        this.blocked = props.blocked;
        this.role = props.role;
        this.createdAt = props.createdAt;

        // Direct statistics (fetched from table, not populated)
        this.submissionCount = props.submissionCount || 0;
        this.passedSubmissionsCount = props.passedSubmissionsCount || 0;

        console.log(`[ProfileSync] Entity Created - ${this.username}:`, {
            subs: this.submissionCount,
            passed: this.passedSubmissionsCount
        });
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
