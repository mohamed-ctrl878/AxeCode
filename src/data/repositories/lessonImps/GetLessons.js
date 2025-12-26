import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetLessons extends ApiContentMethodz {
  async getContent(query) {
    const req = await apiClient({
      url: `${import.meta.env.VITE_API_LESSONS}?${query}`,
      token: true,
    });
    return req.data;
  }
}
