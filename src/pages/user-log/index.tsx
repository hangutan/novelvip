import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import UserLog from '@layouts/User/UserLog';
import { wrapper } from '@store';
import { withAuth, withAuthServer } from '@utils/withAuth';

const UserLogPage = (props) => <UserLog {...props} />;

export default withAuth(UserLogPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['home', 'common'],
			...(await serverSideTranslations(context?.locale, ['home', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
