import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class PostConvirsation extends ApiContentMethodz {
  async postContent(data) {
    const req = await apiClient({
      token: true,
      body: data,
      url: import.meta.env.VITE_CONVIRSATION,
      method: "POST",
    });
    return req.data;
  }
}
