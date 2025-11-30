import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOneConversation extends ApiContentMethodz{
  async getContent(id,query) {
    const req = await apiClient({
      url:`${ import.meta.env.VITE_CONVIRSATION}${id}${query}`,
      token: true,
    });
    return req.data;
  }
}