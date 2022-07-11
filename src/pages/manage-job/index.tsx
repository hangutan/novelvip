// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
// import ManageJob from '@layouts/ManageJob';
import NotFound from '@layouts/NotFound';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

// const ListJobPage = (props) => <ManageJob {...props} />;
const ListJobPage = (props) => <NotFound isSection statusCode={404} {...props} />;

export default withAuth(ListJobPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['job', 'common'],
			...(await serverSideTranslations(context?.locale, ['job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
