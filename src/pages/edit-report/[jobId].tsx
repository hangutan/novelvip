import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Components
import EditReport from '@layouts/EditReport';
// Store
import { wrapper } from '@store';
// Utils
import { withAuth, withAuthServer } from '@utils/withAuth';

const EditReportPage = (props) => <EditReport {...props} />;

export default withAuth(EditReportPage);

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
	const result = {
		props: {
			nameSpaces: ['report-job', 'common'],
			...(await serverSideTranslations(context?.locale, ['report-job', 'common'])),
		},
	};
	return withAuthServer({ store, result, context });
});
