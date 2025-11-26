export class LessonUploadDTO {
  constructor({
    title = "",
    description = [],
    problem_types = [],
    weeks = [],
    course_types = [],
    video = null,
  }) {
    this.title = title;
    this.description = description;
    this.problem_types = problem_types;
    this.weeks = weeks;
    this.course_types = course_types;
    this.video = video;
  }

}
