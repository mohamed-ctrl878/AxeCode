import { apiClient } from "@core/apienv/apiClient";
import { UserAuth } from "@domain/interfaces/MethodzUser/UserAuth";

export default class AuthLogoutBase extends UserAuth {
  async logout() {
    const data = await apiClient({
      url: `${import.meta.env.VITE_API_LOGOUT}`,
      method: "POST",
      token: true,
    });
    return data.data;
  }
}
