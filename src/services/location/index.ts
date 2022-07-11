import services from '@services/index.ts';

const APIs = {
	getLocation(params: object, options: object) {
		return services.get('/api/locations', params, options);
	},
};

export default APIs;
