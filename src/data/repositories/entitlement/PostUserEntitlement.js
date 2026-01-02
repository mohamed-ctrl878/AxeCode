import { apiClient } from "@core/apienv/apiClient";
import { ApiContentMethodz } from "@domain/interfaces/user/ApiContentMethodz";

export class PostUserEntitlement extends ApiContentMethodz {
    async postContent(data){
        console.log(data)
        const req = await apiClient({
            url: import.meta.env.VITE_API_ENTITLEMENTS,
            method: "POST",
            body: data,
            token:true
        })
        return req
    }
}