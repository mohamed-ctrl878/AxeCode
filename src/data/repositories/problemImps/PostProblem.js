import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export default class PostProblem extends ApiContentMethodz {
  async postContent(body) {
    const getData = await apiClient({
      token: true,
      url: import.meta.env.VITE_API_PROBLEM_ADD,
      method: "POST",
      body: { data: body },
    });
    return getData.data;
  }
}
