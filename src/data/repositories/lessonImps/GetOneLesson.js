import { apiClient } from "@core/apienv/apiClient";
import { LessonWhithMedia } from "@domain/entities/lesson/Lesson";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOneLesson extends ApiContentMethodz {
  async getContent(id, query) {
    console.log(id, query);

    const getData = await apiClient({
      method: "GET",
      token: true,
      url: `${import.meta.env.VITE_API_LESSONS}/${id}?${query}`,
    });
    return getData.data;
  }

  async DTOToEntity(id, query) {
    const req = await this.getContent(id, query);
    console.log(req);
    return new LessonWhithMedia(req?.data);
  }
}
