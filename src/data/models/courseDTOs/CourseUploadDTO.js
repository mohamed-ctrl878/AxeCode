export class CourseUploadDTO {
  constructor({
    title = "",
    description = {},
    problem_types = [],
    weeks = [],
    course_types = [],
    image = {},
  }) {
    this.title = title;
    this.description = description;
    this.problem_types = problem_types;
    this.weeks = weeks;
    this.course_types = course_types;
    this.image = image;
  }
}
