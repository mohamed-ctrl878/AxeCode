export class CourseUploadDTO {
  constructor({
    title = "",
    description = {},
    problem_types = [],
    weeks = [],
    course_types = [],
    image = {},
    difficulty = "easy",
  }) {
    this.title = title;
    this.description = description;
    this.problem_types = problem_types;
    this.weeks = weeks;
    this.course_types = course_types;
    this.image = image;
    this.difficulty = difficulty;
  }
}
