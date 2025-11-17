import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class RegesterConfirm extends ApiContentMethodz {
  async getContent(token) {
    const req = await apiClient({
      url: `${import.meta.env.VITE_EMAIL_CONFIRM}${token}`,
    });
    return req.data;
  }
}
