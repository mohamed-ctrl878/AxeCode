import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class ResetPasswordClass extends ApiContentMethodz {
  async postContent(data) {
    console.log(data);
    const req = await apiClient({
      method: "POST",
      url: import.meta.env.VITE_API_RESET_PASS,
      body: data,
      token: true,
    });
    return req.data;
  }
}
