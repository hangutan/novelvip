import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ForgotPassword from '@layouts/Account/ForgotPassword';
import { wrapper } from '@store';
import { withNoAuth, withNoAuthServer } from '@utils/withAuth';

const ForgotPasswordPage = (props) => <ForgotPassword {...props} />;

export default withNoAuth(ForgotPasswordPage, { isFooter: false });

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['account', 'common'],
			...(await serverSideTranslations(context?.locale, ['account', 'common'])),
		},
	};
	return withNoAuthServer({ store, result, context });
});
