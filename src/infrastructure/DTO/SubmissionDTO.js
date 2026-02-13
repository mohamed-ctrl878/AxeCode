import { BaseContentDTO } from './BaseContentDTO';
import { UserDTO } from './UserDTO';

export class SubmissionDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.code = data.code; // {string}
        this.language = data.language; // {string}
        this.verdict = data.verdict || 'pending'; // {string}
        this.executionTime = data.executionTime; // {number}
        this.memoryUsed = data.memoryUsed; // {number}
        this.judgeOutput = data.judgeOutput; // {object}
        this.testCasesPassed = data.testCasesPassed || 0; // {number}
        this.totalTestCases = data.totalTestCases || 0; // {number}

        /**
         * Relationships
         */
        this.problem = data.problem; // {object | ProblemDTO}
        this.user = data.user ? new UserDTO(data.user) : null; // {UserDTO | null}
    }
}
