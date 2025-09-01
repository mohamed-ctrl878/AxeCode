import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";
export default class GetProblemImp extends ApiContentMethodz {
  async getContent() {
    const request = await apiClient({
      url: import.meta.env.VITE_API_PROBLEM_ADD,
    });
    return request.data;
  }
}
