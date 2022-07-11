import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import ReportJob from '@layouts/ReportJob';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const ReportJobPage = (props) => <ReportJob {...props} />;

export default withAuth(ReportJobPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['report-job', 'common'],
			...(await serverSideTranslations(context?.locale, ['report-job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
