import { apiClient } from "@core/apienv/apiClient";

export default class SearchUser {
  async searchByUsername(username) {
    const url = `${import.meta.env.VITE_API_USER}?filters[username][$contains]=${username}&populate=*`;
    const response = await apiClient({
      url,
      method: "GET",
      token: true,
    });
    return response.data;
  }
}
