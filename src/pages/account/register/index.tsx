import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import RegisterLayout from '@layouts/Account/Register';
import { wrapper } from '@store';
import { withNoAuth, withNoAuthServer } from '@utils/withAuth';

const RegisterPage = (props) => <RegisterLayout {...props} />;

export default withNoAuth(RegisterPage, { isFooter: false });

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['account', 'common'],
			...(await serverSideTranslations(context?.locale, ['account', 'common'])),
		},
	};
	return withNoAuthServer({ store, result, context });
});
