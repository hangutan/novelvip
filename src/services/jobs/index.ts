import services from '@services/index.ts';

const APIs = {
	getListJob(params: object, options: object) {
		return services.get('/api/jobs/get-job-for-user', params, options);
	},
	getYourJob(params: object, options: object) {
		return services.get('/api/jobs/your-job', params, options);
	},
	getMyCreatedJob(params: object, options: object) {
		return services.get('/api/jobs', params, options);
	},
	updateJob(params: object, options: object) {
		return services.post('/api/jobs/update', params, options);
	},
	removeJob(params: object, options: object) {
		return services.post('/api/jobs/remove', params, options);
	},
	cancelYourJob(params: object, options: object) {
		return services.post('/api/jobs/cancel-job', params, options);
	},
	createJob(params: object, options: object) {
		return services.post('/api/jobs/create', params, options);
	},
	getJobDetail(params: object, options: object) {
		return services.post('/api/jobs/detail', params, options);
	},
	confirmGetJobForUser(params: object, options: object) {
		return services.post('/api/jobs/confirm-for-user', params, options);
	},
	completeJob(params: object, options: object) {
		return services.post('/api/jobs/complete-job', params, options);
	},
	getReportJob(params: object, options: object) {
		return services.get('/api/jobs/get-report', params, options);
	},
	filterSelect(params: object, options: object) {
		return services.post('/api/filter-select', params, options);
	},
};

export default APIs;
