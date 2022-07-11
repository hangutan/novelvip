import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';
import ReferralLayout from '@layouts/Referral';

const ReferralPage = (props) => <ReferralLayout {...props} />;

export default withAuth(ReferralPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['home', 'common'],
			...(await serverSideTranslations(context?.locale, ['home', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
