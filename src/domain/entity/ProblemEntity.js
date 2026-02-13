import { ContentEntity } from './ContentEntity';

/**
 * ProblemEntity class for coding problems and assessments.
 */
export class ProblemEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {string} props.difficulty
     * @param {object|array} props.description - Blocks
     * @param {Array<string>} props.availableLanguages
     * @param {number} props.points
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.difficulty = props.difficulty;
        this.description = props.description;
        this.availableLanguages = props.availableLanguages || [];
        this.points = props.points || 0;
    }

    /**
     * CSS class for difficulty color coding.
     * @returns {string}
     */
    get difficultyColor() {
        switch (this.difficulty?.toLowerCase()) {
            case 'easy': return 'green';
            case 'medium': return 'orange';
            case 'hard': return 'red';
            default: return 'gray';
        }
    }
}
