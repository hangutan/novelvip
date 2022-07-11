import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Login from '@layouts/Account/Login';
import { wrapper } from '@store';
import { withNoAuth, withNoAuthServer } from '@utils/withAuth';

const LoginPage = (props) => <Login {...props} />;

export default withNoAuth(LoginPage, { isFooter: false });

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['account', 'common'],
			...(await serverSideTranslations(context?.locale, ['account', 'common'])),
		},
	};
	return withNoAuthServer({ store, result, context });
});
