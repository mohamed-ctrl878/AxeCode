import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetConvirsation extends ApiContentMethodz {
  async getContent() {
    const req = await apiClient({
      url: import.meta.env.VITE_CONVIRSATION,
      token: true,
    });
    return req.data;
  }
}
