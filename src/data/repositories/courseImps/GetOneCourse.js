import { apiClient } from "@core/apienv/apiClient";
import { courseDTO } from "@data/models/courseDTO";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class GetOneCourse extends ApiContentMethodz {
  async getContent(id, query) {
    
    console.log(id, query);
    const getData = await apiClient({
      method: "GET",
      token: true,
      url: `${import.meta.env.VITE_API_COURSES}/${id}?${query}`,
    });
    return getData.data;
  }

  async DTOToEntity(id, query) {
    const req = await this.getContent(id, query);

    return new courseDTO(req?.data);
  }
}
