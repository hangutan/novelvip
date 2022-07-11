import services from '@services/index.ts';

const APIs = {
	coinRankingList(params: object, options: object) {
		return services.get('/api/jobs/top-earn-money', params, options);
	},
};

export default APIs;
