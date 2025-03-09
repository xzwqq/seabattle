import { createSlice, createAction } from '@reduxjs/toolkit';

const loginSlices = createSlice({
	name: 'login',
	initialState: {
		response: null,
		error: null
	},
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
