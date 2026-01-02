import { PostUserEntitlement } from "@data/repositories/entitlement/PostUserEntitlement"
import { entitlement_id } from "@domain/reqs_dtos/entitlement_id"
import postUserEntitlementExe from "@domain/usecases/user/postUserEntitlementExe"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingPortal from "../../loading/LoadingPortal"

export default function UserEntitlement({to,id}) {
const navigate = useNavigate()
useEffect(()=>{
   ( async function(){
try{
    const res = await postUserEntitlementExe(new PostUserEntitlement(),new entitlement_id({entitlementId: id,content_types:"course"}))
    navigate(to)
}catch(e){
    if(new Error(e).message.includes("have this content"))navigate(to);
}
    })()
},[to,id])
    return (
        <div>
            <LoadingPortal></LoadingPortal>
        </div>
    )
}