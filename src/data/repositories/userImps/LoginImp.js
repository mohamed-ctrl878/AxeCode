import { apiClient } from "@core/apienv/apiClient";
import { UserAuth } from "@domain/interfaces/MethodzUser/UserAuth";

export default class AuthLoginbase extends UserAuth {
  async login(propertyes) {
    const log = await apiClient(propertyes);
    return log.data;
  }
}
