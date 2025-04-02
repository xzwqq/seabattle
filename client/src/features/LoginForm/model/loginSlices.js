import { createSlice, createAction } from '@reduxjs/toolkit';
const initialState = {
	response: null,
	error: ''
};

const loginSlices = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setResponse: (state, action) => {
			state.response = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		}
	}
});
export const LoginAction = {
	...loginSlices.actions,
	submitLogin: createAction(`${loginSlices.name}/submitLogin`)
};
export default loginSlices.reducer;
