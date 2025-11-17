import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetArticle extends ApiContentMethodz {
  async postContent() {
    const req = await apiClient({
      token: true,
      url: import.meta.env.VITE_ARTICLE,
    });
    return req.data;
  }
}
