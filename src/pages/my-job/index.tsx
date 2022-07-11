// Libraries
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
// import MyJob from '@layouts/MyJob';
import NotFound from '@layouts/NotFound';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

// const MyJobPage = (props) => <MyJob {...props} />;
const MyJobPage = (props) => <NotFound isSection statusCode={404} {...props} />;

export default withAuth(MyJobPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['job', 'common'],
			...(await serverSideTranslations(context?.locale, ['job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
