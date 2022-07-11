import services from '@services/index.ts';

const APIs = {
	receiveNotify(params: object, options: object) {
		return services.post('/api/landing-page/receive-notify', params, options);
	},
	sendContact(params: object, options: object) {
		return services.post('/api/landing-page/contact', params, options);
	},
};

export default APIs;
