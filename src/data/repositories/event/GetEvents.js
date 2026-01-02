import { apiClient } from "@core/apienv/apiClient";

export class GetEvents {
  async getEvents(query = "") {
    const url = `${import.meta.env.VITE_API_EVENTS}?${query}`;
    return await apiClient({
      url,
      method: "GET",
      token: true,
    });
  }
}
