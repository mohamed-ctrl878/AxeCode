import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class PostEvent extends ApiContentMethodz {
    async postContent(data) {
        console.log(data)
        const req = await apiClient({url:import.meta.env.VITE_API_EVENTS, method:"POST", body:{data: data}, token:true})
        return req.data
    }
}