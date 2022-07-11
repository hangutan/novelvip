// Libraries
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface State {
	locations: [];
	providers: [];
	educations: [];
	careers: [];
	lang: string;
	countLoading: number;
}

export const initialState = {
	locations: [],
	providers: [],
	educations: [],
	careers: [],
	lang: 'vi',
	countLoading: 0,
};

const key = 'App';

const Reducer = createSlice({
	name: key,
	initialState,
	reducers: {
		setLocation: (state, action) => ({
			...state,
			locations: action?.payload?.locations,
		}),
		setProviders: (state, action) => ({
			...state,
			providers: action?.payload?.providers,
		}),
		setEducation: (state, action) => ({
			...state,
			educations: action?.payload?.educations,
		}),
		setCareer: (state, action) => ({
			...state,
			careers: action?.payload?.careers,
		}),
		setLanguage: (state, action) => ({
			...state,
			...action?.payload,
		}),
		setLoading: (state, action) => ({
			...state,
			countLoading: state.countLoading + action?.payload?.countLoading,
		}),
	},
	extraReducers: {
		// Mapping state from cookie to server, then server to hydrate
		// Add only words contained in cookies
		[HYDRATE]: (state, action) => ({
			...state,
			lang: action?.payload[key]?.lang || '',
		}),
	},
});

export const { setLocation, setProviders, setEducation, setCareer, setLanguage, setLoading } = Reducer.actions;
export default Reducer.reducer;
