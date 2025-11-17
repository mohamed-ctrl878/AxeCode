import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOneArticle extends ApiContentMethodz {
  async getContent(id) {
    const req = await apiClient({
      url: `${import.meta.env.VITE_ARTICLE}${id}`,
      token: true,
    });
    return req.data;
  }
}
