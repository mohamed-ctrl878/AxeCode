import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class CheckerForIdintify extends ApiContentMethodz {
  async postContent( query) {
    console.log(import.meta.env.VITE_API_USER);
    const req = await apiClient({
      url: `${import.meta.env.VITE_API_USER}?${query}`,
      token: true,
      method: "GET",
    });

    return req;
  }
}
