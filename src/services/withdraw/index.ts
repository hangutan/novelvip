import services from '@services/index.ts';

const APIs = {
	getListWithdraw(params: object, options: object) {
		return services.get('/api/transaction', params, options);
	},
	createWithdraw(params: object, options: object) {
		return services.post('/api/transaction/withdraw', params, options);
	},
	getWithdrawHistory(params: object, options: object) {
		return services.get('/api/transaction/history', params, options);
	},
};

export default APIs;
