import { createSlice, createAction } from "@reduxjs/toolkit";
const waitSlice = createSlice({
    name:'wait',
    initialState:{
        ready: 0,
        queue: null,
        error: null,
    },
    reducers:{
        setQueue: (state, action) =>{
            state.queue = action.payload
        },
        setReady: (state, action) =>{
            state.ready = action.payload
        },
        setError: (state, action) =>{
            state.error = action.payload
        }
    }
})
export const waitActions ={
    ...waitSlice.actions,
    submitReady: createAction(`${waitSlice.name}/submitReady`),
    submitTable: createAction(`${waitSlice.name}/submitTable`)
}
export default waitSlice.reducer