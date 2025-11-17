import { apiClient } from "@core/apienv/apiClient";
import { UserAuth } from "@domain/interfaces/MethodzUser/UserAuth";

export default class AuthLoginbase extends UserAuth {
  async login(propertyes) {
    const log = await apiClient({
      method: "POST",
      url: import.meta.env.VITE_API_LOGIN,
      token: true,
      body: propertyes,
    });
    return log.data;
  }
}
