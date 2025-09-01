import { apiClient } from "@core/apienv/apiClient";
import { UserAuth } from "@domain/interfaces/MethodzUser/UserAuth";

export default class GetMyData extends UserAuth {
  async getMyData() {
    const getIt = await apiClient({
      url: `${import.meta.env.VITE_API_ME}?populate=*`,
      token: true,
    });
    return getIt.data;
  }
}
