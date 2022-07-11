// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import History from '@layouts/History';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const HistoryPage = (props) => <History {...props} />;

export default withAuth(HistoryPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['user', 'common'],
			...(await serverSideTranslations(context?.locale, ['user', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
