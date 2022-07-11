import services from '@services/index.ts';

const APIs = {
	getMe(params: object, options: object) {
		return services.get('/api/users/get-me', params, options);
	},
	updateUser(params: object, options: object) {
		return services.post('/api/users/update', params, options);
	},
	uploadAvatar(params: object, options: object) {
		return services.post('/api/users/upload-avatar', params, options);
	},
	changePassword(params: object, options: object) {
		return services.post('/api/users/change-password', params, options);
	},
	getUserLog(params: object, options: object) {
		return services.get('/api/users/activity', params, options);
	},
	getCareer(params: object, options: object) {
		return services.get('/api/career', params, options);
	},
	getEducation(params: object, options: object) {
		return services.get('/api/education', params, options);
	},
};

export default APIs;
