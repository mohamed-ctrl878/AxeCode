import { apiClient } from "@core/apienv/apiClient";
import { toFormData } from "@core/utils/problemUploader/handellers";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";
import { get } from "idb-keyval";

export class PostMedia extends ApiContentMethodz {
  async postContent(store,mediaType) {
    const file = await get(store[mediaType]);

    console.log("testtest", file);
    const data = toFormData(file);
    const req = await apiClient({
      url: import.meta.env.VITE_API_UPLOADS,
      token: true,
      body: data,
      method: "POST",
      bodyType: "media",
    });


    return req.data;
  }
}
