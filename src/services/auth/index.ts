import services from '@services/index.ts';

const APIs = {
	loginUser(params: object, options: object) {
		return services.post('/api/auth/login', params, options);
	},
	registerUser(params: object, options: object) {
		return services.post('/api/auth/register', params, options);
	},
	loginSocial(params: object, options: object) {
		return services.post('/api/auth/login-social', params, options);
	},
	getCodeResetPassword(params: object, options: object) {
		return services.post('/api/auth/recovery', params, options);
	},
	resetPassword(params: object, options: object) {
		return services.post('/api/auth/reset', params, options);
	},
};

export default APIs;
