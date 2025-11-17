import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOnePost extends ApiContentMethodz {
  async getContent(id) {
    const req = await apiClient({
      url: `${import.meta.env.VITE_POSTS}${id}`,
      token: true,
    });
    return req.data;
  }
}
