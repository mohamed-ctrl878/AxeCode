import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

class GetProblem_types extends ApiContentMethodz {
  async getContent(queryParams) {
    const data = await apiClient({
      url: `${import.meta.env.VITE_API_PROBLEM_TYPES}${queryParams}`,
      method: "GET",
    });
    return data.data;
  }
}
