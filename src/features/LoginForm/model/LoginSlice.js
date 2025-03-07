import { createSLice, createAction } from '@reduxjs/toolkit';

const LoginSlice = createSLice({
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
    ...LoginSlice.action,
    submitLogin: createAction(`${LoginSlice.name}/submitLogin`)
}
export default LoginSlice.reducers