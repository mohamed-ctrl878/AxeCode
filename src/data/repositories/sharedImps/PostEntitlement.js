import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";
export default class PostEntitlement extends ApiContentMethodz {
  async postContent(body) {
    const getData = await apiClient({
      token: true,
      url: import.meta.env.VITE_API_ENTITLEMENTS_SET, // Ensure this ENV var is defined or mock it for now
      method: "POST",
      body: { data: body },
    });
    return getData.data;
  }
}
