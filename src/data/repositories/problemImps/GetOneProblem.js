import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";
export default class GetOneProblem extends ApiContentMethodz {
  async getContent(id, query) {
    const request = await apiClient({
      url: `${import.meta.env.VITE_API_PROBLEM_ADD}${id}${query}`,
    });
    return request.data;
  }
}
