import services from '@services/index.ts';

const APIs = {
	getListProviders(params: object, options: object) {
		return services.get('/api/provider', params, options);
	},
};

export default APIs;
