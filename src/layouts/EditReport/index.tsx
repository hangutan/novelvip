import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import jobService from '@services/jobs';
import ReportJob from '@layouts/ReportJob';
import toastr from '@utils/toastr';
import { MODE_JOB } from '@constants';

type ReportType = {
	[key: string]: string;
};

type EditJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const EditReport = (props: EditJobProps) => {
	const router = useRouter();
	const { jobId } = router.query;

	const { translate } = props;
	const [report, setReport] = useState({
		image: '',
		video: '',
		note: '',
		status: MODE_JOB.STATUS_APPROVED.ACCEPT as unknown as string,
	} as ReportType);

	const getReport = async () => {
		const detailJob = await jobService.getReportJob({ job_id: jobId }, { setAppLoading: true });
		const { success, data } = detailJob || {};

		if (success && data) {
			setReport({
				image: data?.image_complete,
				video: data?.link_complete,
				note: data?.note_complete,
				status: data?.status,
			});
		} else {
			toastr.error('Bạn không thể xem báo cáo này!');
			setTimeout(() => {
				router.push('/list-job');
			}, 2000);
		}
	};

	useEffect(() => {
		if (jobId) {
			getReport();
		}
	}, [jobId]);

	return <ReportJob report={report} translate={translate} />;
};

export default EditReport;
