export class CourseWhithMedia {
  constructor(data) {
    this.title = data?.title;
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.updatedAt = data?.updatedAt;
    this.description = data?.description;
    this.picture = data?.picture;
    this.weeks = data?.weeks;
    this.difficulty = data?.difficulty;
    this.price = data?.price;
    this.rate = data?.rate;
    this.student_count = data?.student_count;
    this.hasAccess = data?.hasAccess;
    this.entitlementsId = data?.entitlementsId
  }
}

export class CourseInfo {
  constructor(data) {
    this.title = data?.title;
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.updatedAt = data?.updatedAt;
    this.picture = data?.picture?.url || data?.picture;
    this.rate = data?.rate || "90%";
    this.student_count = data?.student_count || 0;
    this.price = data?.price || 0;
    this.difficulty = data?.difficulty || "Beginner";
    this.publisher = data?.users_permissions_user?.username || "AxeCode Instructor";
    this.hasAccess = data?.hasAccess || false;
    this.entitlementsId = data?.entitlementsId || ""
  }
}

export class CourseCardView {
  constructor(data) {
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.title = data?.title;
    this.picture = data?.picture?.url || data?.picture;
    this.difficulty = data?.difficulty;
    this.price = data?.price;
    this.rate = data?.rate;
    this.student_count = data?.student_count;
    this.hasAccess = data?.hasAccess;
    this.weeks = data?.weeks;
    this.entitlementsId = data?.entitlementsId
  }
}

export class CoursePreviewView {
  constructor(data) {
    this.id = data?.id;
    this.documentId = data?.documentId;
    this.title = data?.title;
    this.description = data?.description;
    this.picture = data?.picture?.url || data?.picture;
    this.difficulty = data?.difficulty;
    this.price = data?.price;
    this.rate = data?.rate;
    this.student_count = data?.student_count;
    this.instructor = data?.users_permissions_user;
    this.entitlementsId = data?.entitlementsId
    this.weeks = data?.weeks?.map((week) => ({
      id: week?.id,
      title: week?.title,
      lessons: week?.lessons?.map(lesson => ({
        id: lesson?.id,
        title: lesson?.title,
        type: lesson?.type,
        duration: lesson?.video?.duration
      })),
      lessonsCount: week?.lessons?.length || 0,
    }));
    this.hasAccess = data?.hasAccess;
  }
}

export class CourseLearningView {
  constructor(data) {
    this.id = data?.id;
    this.title = data?.title;
    this.entitlementsId = data?.entitlementsId
    this.weeks = data?.weeks?.map((week) => ({
      id: week?.id,
      title: week?.title,
      lessons: week?.lessons?.map((lesson) => ({
        id: lesson?.id,
        title: lesson?.title,
        video: lesson?.video,
        type: lesson?.type,
        resources: lesson?.resources,
        description: lesson?.description
      })),
    }));
    this.hasAccess = data?.hasAccess;
  }
}
