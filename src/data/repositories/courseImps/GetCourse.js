import { apiClient } from "@core/apienv/apiClient";
import {
  CourseCardView,
  CourseLearningView,
  CoursePreviewView,
} from "@domain/entities/course/Course";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetCourse extends ApiContentMethodz {
  async getContent(query) {
    const req = await apiClient({
      url: `${import.meta.env.VITE_API_COURSES}?${query}`,
      token: true,
    });
    return req.data;
  }

  async mappingToCard(query) {
    const data = await this.getContent(query);
    return data?.data?.map((e) => new CourseCardView(e));
  }

  async mappingToPreview(query) {
    const data = await this.getContent(query);
    return data?.data?.map((e) => new CoursePreviewView(e));
  }

  async mappingToLearning(query) {
    const data = await this.getContent(query);
    return data?.data?.map((e) => new CourseLearningView(e));
  }
}
