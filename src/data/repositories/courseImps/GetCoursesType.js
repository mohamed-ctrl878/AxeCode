import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetCoursesType extends ApiContentMethodz {
  async getContent(queryParams) {
    const data = await apiClient({
      url: `${import.meta.env.VITE_API_COURSE_TYPES}?${queryParams}`,
      method: "GET",
    });
    return data.data;
  }
}
