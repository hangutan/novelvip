import services from '@services/index.ts';

const APIs = {
	getRechargeHistory(params: object, options: object) {
		return services.get('/api/transaction/recharge', params, options);
	},
	createCode(params: object, options: object) {
		return services.post('/api/transaction/create-code', params, options);
	},
	confirmTransaction(params: object, options: object) {
		return services.post('/api/transaction/confirm-transaction', params, options);
	},
};

export default APIs;
