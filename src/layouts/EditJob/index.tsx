import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { RootState } from '@store/rootReducer';
import jobService from '@services/jobs';
import CreateJob from '@layouts/CreateJob';
import { GENDERS, MODE_JOB, TIME_UNIT } from '@constants';
import toastr from '@utils/toastr';

type JobType = {
	id: number;
	title: string;
	provider_id: string | number;
	provider_service_id: string | number;
	package_id: string | number;
	area: number[] | null;
	gender: number[] | null;
	education: number[] | null;
	career: number[] | null;
	age: {
		from: number;
		to: number;
	} | null;
	time: number;
	quantity: number;
	price_per: number;
	date_start: string;
	date_end: string;
	link: string;
	description: string;
	status: number;
	steps: { name: string; description: string }[];
};

type EditJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const EditJob = (props: EditJobProps) => {
	const { translate } = props;
	const router = useRouter();
	const { jobId } = router.query;
	const [job, setJob] = useState({
		link: '',
		steps: [],
	} as JobType);

	const providers = useSelector((state: RootState) => state?.App?.providers || []);
	const locations = useSelector((state: RootState) => state?.App?.locations || []);
	const educations = useSelector((state: RootState) => state?.App?.educations || []);
	const careers = useSelector((state: RootState) => state?.App?.careers || []);

	const getJob = async () => {
		const detailJob = await jobService.getJobDetail({ job_id: jobId }, { setAppLoading: true });
		const { success, data } = detailJob || {};

		if (success && data && data?.status !== MODE_JOB.STATUS_CREATE_APPROVED.ACCEPT) {
			setJob(data);
		} else {
			toastr.error(`${translate('You cannot edit this job')}!`);
			setTimeout(() => {
				router.push('/my-job');
			}, 2000);
		}
	};

	useEffect(() => {
		if (jobId) {
			getJob();
		}
	}, [jobId]);

	const buildState = useMemo(() => {
		const {
			id,
			title,
			provider_id: providerId,
			provider_service_id: serviceId,
			package_id: packageId,
			area,
			career,
			education,
			gender,
			age,
			time,
			quantity,
			price_per: price,
			date_start: startTime,
			date_end: endTime,

			link,
			description,
			status,
			steps,
		} = job || {};

		let service = null;
		let _package = null;

		const platform = providers.find((item) => +item?.id === +providerId) || null;

		if (platform) {
			service = platform.services?.find((item) => item?.id === serviceId);

			if (service) {
				_package = service.packages?.find((item) => item?.id === packageId);
			}
		}

		const _area = locations?.filter((item) => area?.includes(+item?.id));
		const _career = careers?.filter((item) => career?.includes(+item?.id));
		const _education = educations?.filter((item) => education?.includes(+item?.id));
		const _gender = GENDERS.filter((item) => gender?.includes(+item?.id));
		const _age = [age?.from, age?.to];

		const _steps = steps?.map((item) => ({
			title: item?.name,
			content: item?.description,
		}));

		const timeUnit = [...TIME_UNIT].reverse().find((item) => (time / item.id) % 1 === 0);

		return {
			isAdvanced: !!area || !!career || !!education || !!gender || !!age,
			job_id: id,
			title,
			platform,
			service,
			package: _package,
			area: _area?.length ? _area : [{ id: 0 }],
			career: _career?.length ? _career : [{ id: 0 }],
			education: _education?.length ? _education : [{ id: 0 }],
			gender: _gender?.length ? _gender : [{ id: 0 }],
			age: (age?.from && age?.to && _age) || [13, 65],
			useAge: !!age,
			time: +time / timeUnit?.id,
			timeUnit,
			quantity,
			price,
			dateRange: {
				start: moment.unix(+startTime) as unknown as string,
				end: moment.unix(+endTime) as unknown as string,
			},
			link,
			description,
			status,
			steps: _steps || [
				{
					title: '',
					content: '',
				},
			],
		};
	}, [job]);

	return buildState?.title ? <CreateJob job={buildState} translate={translate} /> : null;
};

export default EditJob;
