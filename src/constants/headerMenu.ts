import Images from '@constants/image';

export const menu = [
	{
		name: 'Home',
		to: '/home',
		activePath: ['/home'],
		icon: Images.GOVIP,
		showOnMobile: true,
	},
	{
		name: 'List Job',
		to: '/list-job',
		activePath: ['/list-job', '/work-job', '/report-job', '/edit-report'],
		icon: 'assignment',
	},
	{
		name: 'Create Job',
		to: '/create-job',
		activePath: ['/create-job'],
		icon: 'assignment_turned_in',
	},
	{
		name: 'Account',
		to: '/user',
		activePath: ['/user', '/user-log', '/history'],
		icon: 'person',
	},
];

export const userMenu = [
	{
		name: 'Account information',
		to: '/user',
		icon: 'people',
	},
	{
		name: 'Change password',
		to: '/change-password',
		icon: 'password',
	},
	{
		name: 'Settings',
		to: '/settings',
		icon: 'settings_suggest',
	},
];
