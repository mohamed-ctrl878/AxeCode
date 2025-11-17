import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetPost extends ApiContentMethodz {
  async getContent() {
    const req = await apiClient({
      token: true,
      url: import.meta.env.VITE_POSTS,
    });
    return req.data;
  }
}
