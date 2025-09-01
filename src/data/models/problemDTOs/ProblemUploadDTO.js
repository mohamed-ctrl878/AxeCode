export class ProblemChangesDTO {
  constructor({
    dificulty,
    testCases,
    functionName,
    functionReturnType,
    language,
    tittle,
    description,
    courses,
    // problem_types ,
  }) {
    this.functionName = functionName;
    this.functionReturnType = functionReturnType;
    this.language = language;
    this.testCases = testCases;
    this.tittle = tittle;
    this.description = description;
    this.courses = courses;
    // this.problem_types = problem_types;
    this.dificulty = dificulty;
  }
}
