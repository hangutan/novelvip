import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
// import EditJob from '@layouts/EditJob';
import NotFound from '@layouts/NotFound';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

// const EditJobPage = (props) => <EditJob {...props} />;
const EditJobPage = (props) => <NotFound isSection statusCode={404} {...props} />;

export default withAuth(EditJobPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['create-job', 'common'],
			...(await serverSideTranslations(context?.locale, ['create-job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
