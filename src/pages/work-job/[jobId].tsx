import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import WorkJob from '@layouts/WorkJob';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const WorkJobPage = (props) => <WorkJob {...props} />;

export default withAuth(WorkJobPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['job', 'common'],
			...(await serverSideTranslations(context?.locale, ['job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
