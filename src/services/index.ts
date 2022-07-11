// Libraries
import axios, { Method, CancelToken as CancelTokenType } from 'axios';

// Constants
import { store } from '@store';
import { appConfigs } from '@constants';
// Utils
import { getCookie, getSafely } from '@utils';
import toastr from '@utils/toastr';
import { setLoading } from '@store/app/reducer';

axios.defaults.timeout = appConfigs.REQUEST_TIMEOUT;

const { CancelToken } = axios;

const defaults = {
	baseURL: appConfigs.API_HOST,
	headers: ({ token, lang }) => ({
		'Content-Type': 'application/json; charset=utf-8',
		Authorization: `Bearer ${token}`,
		language: lang || 'vi',
	}),
	error: {
		code: 'INTERNAL_ERROR',
		message: 'Có lỗi xảy ra, vui lòng thử lại sau ít phút !',
		status: 503,
		data: {},
	},
};

type Options = {
	isOriginalUrl: boolean;
	setAppLoading: boolean;
	confirmPopup: boolean;
	isOffToast: boolean;
	successMsg: string;
	errorMsg: string;
	lang: string;
};

const api = async (
	method: string,
	url: string,
	params: {
		cancelToken?: CancelTokenType;
		formData?: object;
		userToken?: string;
	},
	options: Options = {
		isOriginalUrl: false,
		setAppLoading: false,
		confirmPopup: null,
		isOffToast: false,
		successMsg: '',
		errorMsg: '',
		lang: 'vi',
	},
) => {
	const cookieToken = getCookie('User.token');
	const lang = getCookie('App.lang');

	const headers = defaults?.headers({ token: cookieToken, lang });
	const { cancelToken, userToken, ...restParams } = params || {};
	const { isOriginalUrl, setAppLoading } = options || {};
	let variables = restParams;

	if (variables && variables?.formData) {
		variables = variables?.formData;
		headers['Content-Type'] = 'multipart/form-data; charset=utf-8';
	}

	// Pass from mobile
	if (userToken) {
		headers.Authorization = `Bearer ${userToken}`;
	}

	if (setAppLoading) {
		store?.dispatch(setLoading({ countLoading: +1 }));
	}

	return axios({
		url: isOriginalUrl ? url : defaults?.baseURL + url,
		method: method as Method,
		headers,
		params: method === 'get' ? variables : undefined,
		data: method !== 'get' ? variables : undefined,
		cancelToken: cancelToken || new CancelToken(() => null),
	})
		.then((response) => {
			const data = response?.data || {};

			if (setAppLoading) {
				setTimeout(() => {
					store?.dispatch(setLoading({ countLoading: -1 }));
				}, 1000);
			}

			const msg = getSafely(() => Object.values(data.error)[0]);

			if (options?.isOffToast || !msg) {
				return data;
			}

			if (data.success) {
				toastr.success(options?.successMsg || data.message || 'Yêu cầu thành công');
			} else {
				toastr.error(options?.errorMsg || data.message || msg || 'Yêu cầu thất bại');
			}

			return data;
		})
		.catch((error) => {
			const data = error?.response?.data || {};
			const msg = data.message || getSafely(() => Object.values(data.error)[0]);

			if (setAppLoading) {
				setTimeout(() => {
					store?.dispatch(setLoading({ countLoading: -1 }));
				}, 1000);
			}

			if (options?.isOffToast || (!msg && !options?.successMsg && !options?.errorMsg)) {
				return data;
			}

			toastr.error(options?.errorMsg || msg || 'Yêu cầu thất bại');

			return data;
		});
};

export default {
	get: (url, params, options) => api('get', url, params, options),
	post: (url, params, options) => api('post', url, params, options),
	put: (url, params, options) => api('put', url, params, options),
	patch: (url, params, options) => api('patch', url, params, options),
	delete: (url, params, options) => api('delete', url, params, options),
};
