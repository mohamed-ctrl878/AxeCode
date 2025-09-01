import { createSlice } from "@reduxjs/toolkit"
const userAuthSlice = createSlice({
    name:"auth",
    initialState:{getuserData:false},
    reducers:{
        logIn:(state)=>{
        state.getuserData = true
        },
        logOut:(state)=>{
            state.getuserData = false
        }
    }
})


export const {logIn , logOut} = userAuthSlice.actions
export default userAuthSlice.reducer