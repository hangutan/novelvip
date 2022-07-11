// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Landing from '@layouts/Landing';
import { wrapper } from '@store';

const LandingPage = (props) => <Landing {...props} />;

export default LandingPage;

export const getServerSideProps = wrapper.getServerSideProps(() => async (context) => {
	const result = {
		props: {
			...(await serverSideTranslations(context?.locale, ['common'])),
		},
	};
	return {
		...result,
		props: {
			...result.props,
		},
	};
});
