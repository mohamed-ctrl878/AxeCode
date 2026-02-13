import { BaseContentDTO } from './BaseContentDTO';

export class ProblemDTO extends BaseContentDTO {
    constructor(data = {}) {
        super(data);
        this.title = data.title; // {string}
        this.slug = data.slug; // {string}
        this.difficulty = data.difficulty || 'easy'; // {string} - Enum: easy, medium, hard
        this.description = data.description; // {object | array} - Blocks
        this.constraints = data.constraints; // {string}
        this.examples = data.examples; // {object | array} - JSON
        this.hints = data.hints; // {object | array} - JSON
        this.functionName = data.functionName; // {string}
        this.functionParams = data.functionParams; // {object | array} - JSON
        this.returnType = data.returnType; // {string}
        this.timeLimit = data.timeLimit || 2000; // {number}
        this.memoryLimit = data.memoryLimit || 256000; // {number}
        this.public = !!data.public; // {boolean}

        /**
         * Relationships
         */
        this.courses = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.courses)) {
            data.courses.forEach(course => this.courses.set(course.id, course));
        }

        this.problem_types = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.problem_types)) {
            data.problem_types.forEach(pt => this.problem_types.set(pt.id, pt));
        }

        this.test_cases = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.test_cases)) {
            data.test_cases.forEach(tc => this.test_cases.set(tc.id, tc));
        }

        this.submissions = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.submissions)) {
            data.submissions.forEach(sub => this.submissions.set(sub.id, sub));
        }

        this.code_templates = new Map(); // {Map<string | number, object>}
        if (Array.isArray(data.code_templates)) {
            data.code_templates.forEach(tpl => this.code_templates.set(tpl.id, tpl));
        }
    }
}
