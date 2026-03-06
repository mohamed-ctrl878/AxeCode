import { ContentEntity } from './ContentEntity';

/**
 * ProblemEntity class for coding problems and assessments.
 */
export class ProblemEntity extends ContentEntity {
    /**
     * @param {object} props
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.slug = props.slug;
        this.difficulty = props.difficulty;
        this.description = props.description;

        // Problem metadata
        this.constraints = props.constraints;
        this.examples = props.examples || [];
        this.hints = props.hints || [];
        this.functionName = props.functionName;
        this.functionParams = props.functionParams || [];
        this.returnType = props.returnType;
        this.timeLimit = props.timeLimit || 2000;
        this.memoryLimit = props.memoryLimit || 256000;

        // Relations
        this.testCases = props.testCases || [];
        this.codeTemplates = props.codeTemplates || [];
        this.problemTypes = props.problemTypes || [];
        this.submissionStatus = props.submissionStatus || 'New';

        // Interactions
        this.likesCount = props.likesCount || 0;
        this.isLiked = props.isLiked || false;
        this.commentsCount = props.commentsCount || 0;

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

export class CardProblemEntity {
    constructor(props = {}) {
        this.id = props.id;
        this.documentId = props.documentId;
        this.title = props.title;
        this.difficulty = props.difficulty;
        this.status = props.status || 'New';
        this.points = props.points || 0;
        this.tags = props.tags || [];
    }
}