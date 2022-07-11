// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import HomeLayout from '@layouts/Home';
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const HomePage = (props) => <HomeLayout {...props} />;

export default withAuth(HomePage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['home', 'common'],
			...(await serverSideTranslations(context?.locale, ['home', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
