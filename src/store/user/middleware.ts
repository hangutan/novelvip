// Libraries
import * as Effects from 'redux-saga/effects';

// Services
import authServices from '@services/auth/index.ts';
import userServices from '@services/user';

// Actions
import { initialStateUser, setUserInfo } from './reducer';

const { call, takeEvery, put }: { call: any; takeEvery: any; put: any } = Effects;

const KEY = 'USER';

export const actionTypes = {
	LOGIN_USER: `__MW__${KEY}__LOGIN_USER`,
	LOGIN_WITH_TOKEN: `__MW__${KEY}__LOGIN_WITH_TOKEN`,
	REGISTER_USER: `__MW__${KEY}__REGISTER_USER`,
	SET_USER_INFO: `__MW__${KEY}__SET_USER_INFO`,
	GET_CODE_RESET_PASSWORD: `__MW__${KEY}__GET_CODE_RESET_PASSWORD`,
	RESET_PASSWORD: `__MW__${KEY}__RESET_PASSWORD`,
	GET_ME: `__MW__${KEY}__GET_ME`,
	UPDATE_USER: `__MW__${KEY}__UPDATE_USER`,
	HANDLE_LOGOUT: `__MW__${KEY}__HANDLE_LOGOUT`,
	CHANGE_PASSWORD: `__MW__${KEY}__CHANGE_PASSWORD`,
};

function* handleLoginWithToken(args) {
	try {
		const { token } = args?.payload || {};

		if (token) {
			yield put(
				setUserInfo({
					...initialStateUser,
					token,
				}),
			);
		}
	} catch (e) {
		// Error
	}
}

function* handleLoginUser(args) {
	try {
		const { username, password, setModalVisible, goBack } = args?.payload || {};

		const params = {
			username,
			password,
		};

		const loginUser = yield call(authServices.loginUser, params);

		if (loginUser?.success) {
			yield put(
				setUserInfo({
					...initialStateUser,
					token: loginUser?.token,
					userInfo: loginUser?.user,
				}),
			);

			goBack();
		} else {
			setModalVisible(true);
			yield put(
				setUserInfo({
					...initialStateUser,
				}),
			);
		}
	} catch (e) {
		// Error
	}
}

function* handleRegisterUser(args) {
	try {
		const {
			username,
			email,
			password,
			confirm_password: confirmPassword,
			captcha_token: captchaToken,
			goBack,
			refreshCaptcha,
		} = args?.payload || {};

		const params = {
			username,
			email,
			password,
			confirm_password: confirmPassword,
			captcha_token: captchaToken,
		};

		const registerUser = yield call(authServices.registerUser, params);

		if (registerUser?.success && typeof goBack === 'function') {
			goBack();
		} else {
			refreshCaptcha();
		}
	} catch (e) {
		// Error
	}
}

function* handleGetCodeResetPassword(args) {
	try {
		const { email } = args?.payload || {};

		const params = {
			email,
		};

		const getCodeReset = yield call(authServices.getCodeResetPassword, params);
	} catch (e) {
		// Error
	}
}

function* handleResetPassword(args) {
	try {
		const {
			email,
			token,
			password,
			password_confirmation: passwordConfirmation,
			setModalVisible,
		} = args?.payload || {};

		const params = {
			email,
			token,
			password,
			password_confirmation: passwordConfirmation,
			setModalVisible,
		};

		const resetPassword = yield call(authServices.resetPassword, params);

		if (resetPassword?.success && resetPassword?.token) {
			if (typeof setModalVisible === 'function') {
				setModalVisible(true);
			}
			yield put(
				setUserInfo({
					token: resetPassword?.token,
				}),
			);
		}
	} catch (e) {
		// Error
	}
}

function* handleSetUserInfo(args) {
	try {
		yield put(setUserInfo(args.payload));

		if (typeof args?.payload?.cb === 'function') {
			args.payload.cb();
		}
	} catch (e) {
		// Error
	}
}

function* handleGetMe(args) {
	try {
		const { email, userToken } = args?.payload || {};

		const params = {
			email,
			userToken,
		};

		const getMe = yield call(userServices.getMe, params);

		if (getMe?.success) {
			yield handleSetUserInfo({
				payload: {
					userInfo: getMe?.data,
				},
			});
		} else {
			yield handleSetUserInfo({
				payload: { ...initialStateUser },
			});
		}
	} catch (e) {
		// Error
	}
}

function* handleUpdateUser(args) {
	try {
		const {
			name,
			birthday,
			phone,
			education,
			email,
			homeTown,
			gender,
			career,
			facebook,
			userInfo,
			avatar,
			referral,
			cb,
		} = args?.payload || {};

		let image = '';

		if (avatar?.file) {
			const formData = new FormData();

			formData.append('image', avatar?.file);
			const uploadImage = yield call(userServices.uploadAvatar, {
				formData,
			});

			if (uploadImage?.success) {
				image = uploadImage?.data;
			} else {
				cb({ type: 'img', isImg: false });
			}
		}

		const params = {
			name,
			birthday,
			phone,
			education,
			email,
			home_town: homeTown,
			gender,
			career,
			referral,
			facebook,
			...(image && { avatar: image }),
		};

		const updateUser = yield call(userServices.updateUser, params);

		if (updateUser?.success) {
			if (typeof cb === 'function') {
				cb(updateUser);
			}

			yield handleSetUserInfo({
				payload: {
					userInfo: {
						...userInfo,
						...params,
					},
				},
			});
		}
	} catch (e) {
		// Error
	}
}

function* handleChangePassword(args) {
	try {
		const { old_password, new_password, handleCancel } = args?.payload || {};
		const params = {
			old_password,
			new_password,
		};
		const changePass = yield call(userServices.changePassword, params);
		if (changePass?.success) {
			handleCancel();
		}
	} catch (e) {}
}

function* handleLogoutUser(args) {
	try {
		yield handleSetUserInfo({
			payload: { ...initialStateUser },
		});
	} catch (e) {
		// Error
	}
}

export default function* middlewareUser() {
	yield takeEvery(actionTypes.LOGIN_USER, handleLoginUser);
	yield takeEvery(actionTypes.LOGIN_WITH_TOKEN, handleLoginWithToken);
	yield takeEvery(actionTypes.REGISTER_USER, handleRegisterUser);
	yield takeEvery(actionTypes.SET_USER_INFO, handleSetUserInfo);
	yield takeEvery(actionTypes.GET_CODE_RESET_PASSWORD, handleGetCodeResetPassword);
	yield takeEvery(actionTypes.RESET_PASSWORD, handleResetPassword);
	yield takeEvery(actionTypes.GET_ME, handleGetMe);
	yield takeEvery(actionTypes.UPDATE_USER, handleUpdateUser);
	yield takeEvery(actionTypes.HANDLE_LOGOUT, handleLogoutUser);
	yield takeEvery(actionTypes.CHANGE_PASSWORD, handleChangePassword);
}
