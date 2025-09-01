export class CourseUploadDTO {
  constructor({
    title = "",
    description = {},
    problem_types = [],
    weeks = [],
    course_types = [],
    picture = {},
  }) {
    this.title = title;
    this.description = description;
    this.problem_types = problem_types;
    this.weeks = weeks;
    this.course_types = course_types;
    this.picture = picture;
  }
}
