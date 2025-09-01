import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export default class PostCourses extends ApiContentMethodz {
  async postContent(data) {
    const req = await apiClient({
      url: import.meta.env.VITE_API_COURSES,
      token: true,
      body: { data: data },
      method: "POST",
    });

    return req.data;
  }
}
