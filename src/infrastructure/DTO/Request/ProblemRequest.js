import { BaseRequest } from './BaseRequest';

/**
 * Request DTO for algorithm Problem creation/update.
 */
export class ProblemRequest extends BaseRequest {
    constructor(data = {}) {
        super();
        this.title = data.title;
        this.difficulty = data.difficulty || 'easy'; // Enum: easy, medium, hard
        this.description = data.description; // {blocks}
        this.constraints = data.constraints;
        this.examples = data.examples; // {json}
        this.hints = data.hints; // {json}
        this.functionName = data.functionName;
        this.functionParams = data.functionParams; // {json}
        this.returnType = data.returnType;
        this.timeLimit = data.timeLimit || 2000;
        this.memoryLimit = data.memoryLimit || 256000;
        this.public = !!data.public;
        
        // Relationships
        this.courses = data.courseIds || [];
        this.problem_types = data.problemTypeIds || [];
        this.test_cases = data.testCaseIds || [];
        this.code_templates = data.codeTemplateIds || [];
        this.tags = data.tagIds || [];
    }

    validate() {
        super.validate();
        if (!this.title) throw new Error("Problem title is required.");
        if (!this.functionName) throw new Error("Function name is required for problems.");
    }
}
