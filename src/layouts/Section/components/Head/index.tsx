// Libraries
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
	translate: (str: string, obj?: { text: string }) => string;
};

const listRoutes = [
	{ name: 'Activity Log', to: '/user-log' },
	{ name: 'My Job', to: '/my-job' },
	{ name: 'List Job', to: '/list-job' },
	{ name: 'Manage Job', to: '/manage-job' },
	{ name: 'Create Job', to: '/create-job' },
	{ name: 'Edit Job', to: '/edit-job' },
	{ name: 'Edit Report', to: '/edit-report' },
	{ name: 'Report Job', to: '/report-job' },
	{ name: 'Work Job', to: '/work-job' },
	{ name: 'Recharge', to: '/recharge' },
	{ name: 'Withdraw', to: '/withdraw' },
	{ name: 'Create Job', to: '/create-job' },
	{ name: 'Account information', to: '/user' },
	{ name: 'Leaderboard', to: '/ranking' },
	{ name: 'Transaction history', to: '/history' },
];

const HeadComp = (props: Props) => {
	const router = useRouter();
	const { translate: prevTranslate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;

	const translate = (str, obj?) => prevTranslate(str, { ...obj, ns: 'common' });

	const data = listRoutes.find((item) => router.pathname.includes(item.to));

	return (
		<>
			<Head>
				<title>
					{data?.name ? translate(data.name) : `Govip - ${translate('Real user seeding platform')}`}
				</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
				/>
				<meta name="title" content="Govip" />
				<meta
					name="description"
					content={`${translate('Real user seeding platform')} - ${translate(
						'Connecting users and brands through an online platform',
					)}`}
				/>
				<meta property="title" content="Govip" />
				<meta property="description" content={`Govip - ${translate('Real user seeding platform')}`} />
				<meta property="og:url" content="https://govip.online" />
				<meta property="og:title" content="Govip" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Govip" />
				<meta property="og:description" content={`Govip - ${translate('Real user seeding platform')}`} />
				{/* <meta
					property="og:image"
					content="https://chotdon.vn/resources/web/assets/images/home_page/share/chotdon.jpg"
				/> */}
				<link rel="icon" href="/favicon.png" />
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
				/>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
				/>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
				/>
			</Head>
		</>
	);
};

export default HeadComp;
