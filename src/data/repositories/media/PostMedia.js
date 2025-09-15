import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class PostMedia extends ApiContentMethodz {
  async postContent(data) {
    // for (const pair of data.entries()) {
    //   console.log("formData entry:", pair[0], pair[1]);
    // }
    console.log("Posting media with data:", data);
    const req = await apiClient({
      url: import.meta.env.VITE_API_UPLOADS,
      token: true,
      body: data,
      method: "POST",
      bodyType: "formData",
    });

    return req.data;
  }
}
