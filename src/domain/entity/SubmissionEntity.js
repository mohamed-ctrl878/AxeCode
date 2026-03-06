import { BaseEntity } from './BaseEntity';

/**
 * SubmissionEntity class for code submissions and execution results.
 */
export class SubmissionEntity extends BaseEntity {
    /**
     * @param {object} props
     */
    constructor(props = {}) {
        super(props);
        this.code = props.code;
        this.language = props.language;
        this.verdict = props.verdict || 'pending';
        this.executionTime = props.executionTime;
        this.memoryUsed = props.memoryUsed;
        this.judgeOutput = props.judgeOutput || { results: [] };
        this.testCasesPassed = props.testCasesPassed || 0;
        this.totalTestCases = props.totalTestCases || 0;

        // Relationships
        this.problem = props.problem;
        this.user = props.user;
    }

    /**
     * Get isolated user stdout from all test cases.
     * @returns {string}
     */
    get consolidatedUserStdout() {
        if (!this.judgeOutput?.results) return '';
        return this.judgeOutput.results
            .map(res => res.userStdout || '')
            .filter(stdout => stdout.trim() !== '')
            .join('\n---\n');
    }

    /**
     * Check if submission is successful.
     * @returns {boolean}
     */
    get isAccepted() {
        return this.verdict === 'accepted';
    }
}
