import { createSlice, createAction } from '@reduxjs/toolkit';

const loginSlice = createSlice({
	name: 'login',
    initialState:{
        response: null,
        error: null,
    },
    reducers: {
        setResponse: (state, action) =>{
            state.response = action.payload
        },
        setError: (state, action) =>{
            state.error = action.payload
        }
    }
});
export const LoginAction ={
    ...loginSlice.actions,
    submitLogin: createAction(`${loginSlice.name}/submitLogin`)
}
export default loginSlice.reducer