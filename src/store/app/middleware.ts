// Libraries
import * as Effects from 'redux-saga/effects';

// Services
import locationServices from '@services/location';
import providersServices from '@services/providers';
import userServices from '@services/user';
// Actions
import { setLocation, setProviders, setEducation, setCareer } from '@store/app/reducer';

const { call, takeEvery, put }: { call: any; takeEvery: any; put: any } = Effects;

const KEY = 'APP';

export const actionTypes = {
	GET_LOCATIONS: `__MW__${KEY}__GET_LOCATIONS`,
	GET_PROVIDERS: `__MW__${KEY}__GET_PROVIDERS`,
	GET_EDUCATIONS: `__MW__${KEY}__GET_EDUCATIONS`,
	GET_CAREERS: `__MW__${KEY}__GET_CAREERS`,
};

function* handleLocation(args) {
	try {
		const locations = yield call(locationServices.getLocation);

		yield put(setLocation({ locations: locations?.data }));
	} catch (e) {
		// Error
	}
}

function* handleGetProviders() {
	try {
		const res = yield call(providersServices.getListProviders);

		yield put(
			setProviders({
				providers: res?.data,
			}),
		);
	} catch (e) {
		yield put(
			setProviders({
				providers: [],
			}),
		);
	}
}

function* handleEducation(args) {
	try {
		const educations = yield call(userServices.getEducation);

		yield put(setEducation({ educations: educations?.data }));
	} catch (e) {
		// Error
	}
}

function* handleCareer(args) {
	try {
		const careers = yield call(userServices.getCareer);

		yield put(setCareer({ careers: careers?.data }));
	} catch (e) {
		// Error
	}
}

export default function* middlewareUser() {
	yield takeEvery(actionTypes.GET_LOCATIONS, handleLocation);
	yield takeEvery(actionTypes.GET_PROVIDERS, handleGetProviders);
	yield takeEvery(actionTypes.GET_EDUCATIONS, handleEducation);
	yield takeEvery(actionTypes.GET_CAREERS, handleCareer);
}
