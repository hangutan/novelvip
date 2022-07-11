// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
// import Recharge from '@layouts/Recharge';
import NotFound from '@layouts/NotFound';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

// const RechargePage = (props) => <Recharge {...props} />;
const RechargePage = (props) => <NotFound isSection statusCode={404} {...props} />;

export default withAuth(RechargePage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			...(await serverSideTranslations(context?.locale, ['common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
