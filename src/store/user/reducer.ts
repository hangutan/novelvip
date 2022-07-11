// Libraries
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface State {
	token: string; // token to access API
	userInfo: object; // info user from API get-me
	authentication: object; // authentication by social (Google, ...)
}

export const initialStateUser = {
	token: '',
	userInfo: {
		username: '',
	},
	authentication: {},
};

const key = 'User';

const Reducer = createSlice({
	name: key,
	initialState: initialStateUser,
	reducers: {
		setUserInfo: (state, action) => ({
			...state,
			...action?.payload,
		}),
	},
	extraReducers: {
		// Mapping state from cookie to server, then server to hydrate
		// Add only words contained in cookies
		[HYDRATE]: (state, action) => ({
			...state,
			token: action?.payload[key]?.token || '',
		}),
	},
});

export const { setUserInfo } = Reducer.actions;
export default Reducer.reducer;
