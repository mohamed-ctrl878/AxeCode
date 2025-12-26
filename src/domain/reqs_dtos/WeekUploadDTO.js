export class WeekUploadDTO {
  constructor(data) {
    this.title = data.title;
    this.course = data.course; // ID
    this.lessons = data.lessons; // Array of IDs
  }
}
