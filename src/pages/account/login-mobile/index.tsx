import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import LoginMobile from '@layouts/Account/LoginMobile';
import { wrapper } from '@store';
import { withNoAuth, withNoAuthServer } from '@utils/withAuth';

const LoginMobilePage = (props) => <LoginMobile {...props} />;

export default LoginMobilePage;

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['account', 'common'],
			...(await serverSideTranslations(context?.locale, ['account', 'common'])),
		},
	};
	return result;
});
