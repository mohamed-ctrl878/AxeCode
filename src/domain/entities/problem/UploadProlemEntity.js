import { problemDTO } from "@data/models/problemDTOs/ProblemDTO";

export class UploadProlemEntity extends problemDTO {
  constructor({
    testCases = {},
    functionName = "",
    functionReturnType = "",
    language = "",
    dificulty = "esey",
    tittle = "",
    description = [],
    courses = [],
    comments = [],
    problem_types = [],
  }) {
    super({
      testCases,
      functionName,
      functionReturnType,
      language,
      dificulty,
      tittle,
      description,
      courses,
      comments,
      problem_types,
    });
  }
}
