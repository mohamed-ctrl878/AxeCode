import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class ForgetPasswordClass extends ApiContentMethodz {
  async postContent(data) {
    const req = await apiClient({
      url: import.meta.env.VITE_API_FORGET_PASS,
      token: true,
      body: data,
      method: "POST",
    });

    return req.data;
  }
}
