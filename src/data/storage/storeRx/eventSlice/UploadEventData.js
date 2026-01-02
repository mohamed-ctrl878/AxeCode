import { EventDTO } from "@domain/reqs_dtos/EventDTO";
import { createSlice } from "@reduxjs/toolkit";






const UploadEventData = createSlice({
    name: "UploadEventData",
    initialState: new EventDTO({}),
    reducers: {
        setData: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetData: () => {
            return new EventDTO({});
        }
    }
});

export const  {setData,resetData} = UploadEventData.actions

export default UploadEventData.reducer
