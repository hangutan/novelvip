import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';
import Ranking from '@layouts/Ranking';

const RankingPage = (props) => <Ranking {...props} />;

export default withAuth(RankingPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['home', 'common'],
			...(await serverSideTranslations(context?.locale, ['home', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
