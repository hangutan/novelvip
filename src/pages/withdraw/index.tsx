// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
// import Withdraw from '@layouts/Withdraw';
import NotFound from '@layouts/NotFound';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

// const WithdrawPage = (props) => <Withdraw {...props} />;
const WithdrawPage = (props) => <NotFound isSection statusCode={404} {...props} />;

export default withAuth(WithdrawPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			...(await serverSideTranslations(context?.locale, ['common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
