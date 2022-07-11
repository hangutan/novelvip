export const PROJECT_ID = 'go-vip';
export const PROJECT_TYPE = 'next-js';
export const MODE_JOB = {
	JOB_CURRENT: 'JOB_CURRENT', // in job pool, user can get
	JOB_PROCESSING: 'JOB_PROCESSING', // had clicked button get job
	JOB_COMPLETED: 'JOB_COMPLETED', // had called api complete
	JOB_APPROVED: 'JOB_APPROVED', // had approved by admin
	STATUS_APPROVED: {
		ACCEPT: 4,
		DENY: 5,
	},

	// for create job
	JOB_CREATE_PROCESSING: 'JOB_CREATE_PROCESSING', // waiting for admin approve
	JOB_CREATE_APPROVED: 'JOB_CREATE_APPROVED', // had approved by admin
	JOB_CREATE_CREATING: 'JOB_CREATE_CREATING', // create job on client
	STATUS_CREATE_APPROVED: {
		ACCEPT: 1,
		DENY: 2,
	},

	// for work job
	WORK_JOB: 'WORK_JOB',
};

export const FILTER = {
	PRICE: {
		MIN: 0,
		MAX: 10000,
	},
};

export const GENDERS = [
	{
		id: 1,
		name: 'male',
		label: 'Male',
	},
	{
		id: 2,
		name: 'female',
		label: 'Female',
	},
	{
		id: 3,
		name: 'other',
		label: 'Other',
	},
];

export const TIME_UNIT = [
	{
		id: 1,
		name: 'minute',
		label: 'minute(s)',
	},
	{
		id: 60,
		name: 'hour',
		label: 'hour(s)',
	},
	{
		id: 1440,
		name: 'day',
		label: 'day(s)',
	},
	{
		id: 10080,
		name: 'week',
		label: 'week(s)',
	},
	{
		id: 43200,
		name: 'month',
		label: 'month(s)',
	},
];

export const ACADEMICLEVEL = [
	{
		id: 0,
		name: 'elementary',
		label: 'Tiểu học',
	},
	{
		id: 1,
		name: 'secondschool',
		label: 'Trung cấp',
	},
	{
		id: 2,
		name: 'highschool',
		label: 'Trung học phổ thông',
	},
	{
		id: 3,
		name: 'university',
		label: 'Đại học',
	},
	{
		id: 4,
		name: 'other',
		label: 'Khác',
	},
];

export const CAREER = [
	{
		id: 0,
		name: 'finance',
		label: 'Tài chính và Ngân hàng',
	},
	{
		id: 1,
		name: 'IT',
		label: 'Công nghệ thông tin',
	},
	{
		id: 2,
		name: 'agriculture',
		label: 'Nông nghiệp',
	},
	{
		id: 3,
		name: 'otther',
		label: 'Khác',
	},
];

export const AGE_RANGE = [1, 100];

export const appConfigs = {
	API_HOST: process.env.NEXT_PUBLIC_API_HOST,
	DOMAIN_HOST: process.env.NEXT_PUBLIC_DOMAIN_HOST,
	RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
	GOOGLE_AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
	REQUEST_TIMEOUT: 5000,
	CURRENCY: 'VNĐ',
};
