import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";
export default class GetCourses extends ApiContentMethodz {
  async getContent(query) {
    const getData = await apiClient({
      method: "GET",
      token: true,
      url: `${import.meta.env.VITE_API_WEEKS}?${query}`,
    });
    return getData.data;
  }
}
