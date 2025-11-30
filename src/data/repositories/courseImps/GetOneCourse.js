import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOneCourse extends ApiContentMethodz {
  async getContent(id, query) {
    const getData = await apiClient({
      method: "GET",
      token: true,
      url: `${import.meta.env.VITE_API_WEEKS}?${id}${query}`,
    });
    return getData.data;
  }
}
