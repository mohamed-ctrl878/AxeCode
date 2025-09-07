import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class PostMedia extends ApiContentMethodz {
  async postContent(data) {
    const req = await apiClient({
      url: import.meta.env.VITE_API_UPLOADS,
      token: true,
      body: { data: data },
      method: "POST",
    });

    return req.data;
  }
}
