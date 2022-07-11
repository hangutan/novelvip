// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import ListJob from '@layouts/ListJob';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const ListJobPage = (props) => <ListJob {...props} />;

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
