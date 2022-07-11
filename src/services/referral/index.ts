import services from '@services/index.ts';

const APIs = {
	listReferral(params: object, options: object) {
		return services.get('/api/users/referral', params, options);
	},
	listReferralRanking(params: object) {
		return services.get('/api/users/top-referral', params, {});
	},
	referralStats() {
		return services.get('/api/users/total-referral', {}, {});
	},
};

export default APIs;
