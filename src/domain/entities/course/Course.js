export class CourseWhithMedia {
  constructor({
    title,
    id,
    documentId,
    updatedAt,
    description,
    picture,
    lessons,
  }) {
    this.title = title;
    this.id = id;
    this.documentId = documentId;
    this.updatedAt = updatedAt;
    this.description = description;
    this.picture = picture;
    this.lessons = lessons;
  }
}

export class CourseInfo {
  constructor({
    title,
    id,
    documentId,
    updatedAt,
    picture,
    rate = "100%",
    viewers = 1333,
    publisher = "mohamed mahmoud",
  }) {
    this.title = title;
    this.id = id;
    this.documentId = documentId;
    this.updatedAt = updatedAt;
    this.picture = picture?.url;
    this.rate = rate;
    this.viewers = viewers;
    this.publisher = publisher;
  }
}

export class CourseCardView {
  constructor(data) {
    this.id = data?.id;
    this.title = data?.title;
    this.picture = data?.picture;
    this.difficulty = data?.difficulty;
  }
}

export class CoursePreviewView {
  constructor(data) {
    this.title = data?.title;
    this.description = data?.description;
    this.weeks = data?.weeks?.map((week) => ({
      title: week?.title,
      lessonsCount: week?.lessons?.length || 0,
    }));
  }
}

export class CourseLearningView {
  constructor(data) {
    this.title = data?.title;
    this.weeks = data?.weeks?.map((week) => ({
      title: week?.title,
      lessons: week?.lessons?.map((lesson) => ({
        title: lesson?.title,
        video: lesson?.video,
      })),
    }));
  }
}
