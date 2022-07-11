// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import UserInfo from '@layouts/User/User';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const UserInfoPage = (props) => <UserInfo {...props} />;

export default withAuth(UserInfoPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['user', 'common'],
			...(await serverSideTranslations(context?.locale, ['user', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
