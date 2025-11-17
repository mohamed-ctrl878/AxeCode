import { apiClient } from "@core/apienv/apiClient";
import { UserAuth } from "@domain/interfaces/MethodzUser/UserAuth";

export default class RegisterAuthBase extends UserAuth {
  async register(body) {
    const data = await apiClient({
      token: true,
      method: "POST",
      url: import.meta.env.VITE_API_REGISTER,
      body: body,
    });

    return data.data;
  }
}
