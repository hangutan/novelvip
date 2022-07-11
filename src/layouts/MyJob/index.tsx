import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import moment from 'moment';
import classnames from 'classnames';

import { RootState } from '@store/rootReducer';
import jobService from '@services/jobs';
import Images from '@constants/image';
import { MODE_JOB, TIME_UNIT, GENDERS } from '@constants';
import Filter from '@components/Filter';
import Tabs from '@components/Tabs';
import useListJob from '@hooks/useListJob';
import styles from '@layouts/ListJob/styles.module.scss';
import toastr from '@utils/toastr';

import ModalCreateJob from './components/ModalCreateJob';

const MODE = {
	FIRST_LIST: MODE_JOB.JOB_CREATE_CREATING,
	SECOND_LIST: MODE_JOB.JOB_CREATE_PROCESSING, // 0: đã tạo, 1: chấp nhận, 2: từ chối
	THIRD_LIST: MODE_JOB.JOB_CREATE_APPROVED,
};

type MyJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const MyJob = (props: MyJobProps) => {
	const router = useRouter();
	const { status, job } = router.query;

	const { translate } = props;

	const providers = useSelector((state: RootState) => state?.App?.providers || []);
	const locations = useSelector((state: RootState) => state?.App?.locations || []);
	const educations = useSelector((state: RootState) => state?.App?.educations || []);
	const careers = useSelector((state: RootState) => state?.App?.careers || []);

	const [editingJob, setEditingJob] = useState(undefined);
	const [isShow, setShow] = useState(false);
	const toggle = () => setShow(!isShow);

	const listTabs = [
		{ id: MODE.FIRST_LIST, label: translate('Create new Job') },
		{ id: MODE.SECOND_LIST, label: translate('Pending Job') },
		{ id: MODE.THIRD_LIST, label: translate('Approved Job') },
	];

	const defaultMode = () => {
		switch (status) {
			case 'processing':
				return MODE_JOB.JOB_CREATE_PROCESSING;
			case 'approved':
				return MODE_JOB.JOB_CREATE_APPROVED;
			default:
				return MODE_JOB.JOB_CREATE_CREATING;
		}
	};

	const getSecondList = async ({ filter, page }) => {
		const fetchData = await jobService.getMyCreatedJob(
			{
				limit: 10,
				status: 'processing',
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const getThirdList = async ({ filter, page }) => {
		const fetchData = await jobService.getMyCreatedJob(
			{
				limit: 10,
				status: 'approved',
				page,
				search: filter?.search,
				price_per: filter?.price,
				area: filter?.area?.id,
				career: filter?.career?.id,
				provider_id: filter?.platform?.id,
				provider_service_id: filter?.service?.id,
				package_id: filter?.package?.id,
			},
			{ setAppLoading: true },
		);

		return fetchData;
	};

	const getJob = async (jobId) => {
		const detailJob = await jobService.getJobDetail({ job_id: jobId }, { setAppLoading: true });
		const { success, data } = detailJob || {};

		if (success && data && data?.status !== MODE_JOB.STATUS_CREATE_APPROVED.ACCEPT) {
			setEditingJob(data);
		} else {
			toastr.error(`${translate('You cannot edit this job')}!`);
		}
	};

	const handleEditJob = async (jobId) => {
		await getJob(jobId);
		toggle();
	};

	const { mode, onClickApplyFilter, onClickChangeTab, renderListJob, switchRenderDetail, handleWhenChangeFilter } =
		useListJob({
			MODE,
			defaultMode: defaultMode(),
			styles,
			services: { getSecondList, getThirdList },
			translate,
			handleEditJob,
		});

	const buildState = useMemo(() => {
		if (!editingJob) return undefined;

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
		} = editingJob || {};

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
			area: _area?.length ? _area : [],
			career: _career?.length ? _career : [],
			education: _education?.length ? _education : [],
			gender: _gender?.length ? _gender : [],
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
	}, [editingJob]);

	useEffect(() => {
		if (status === 'edit' && !!job) {
			handleEditJob(job);
		}
	}, []);

	return (
		<>
			<Tabs mode={mode} listTab={listTabs} handleOnChange={onClickChangeTab} />
			<main
				className={classnames(
					styles['wrapper-list-job'],
					mode === MODE_JOB.JOB_CREATE_CREATING && styles['create-job'],
				)}
			>
				<div
					className={styles['job-container']}
					style={{ display: mode !== MODE_JOB.JOB_CREATE_CREATING ? 'block' : 'none' }}
				>
					<Filter onClick={onClickApplyFilter} translate={translate} />

					{mode !== MODE_JOB.JOB_CREATE_CREATING && (
						<div className={styles['job-information']}>
							<div className={styles['job-list']}>{renderListJob()}</div>

							<div className={styles['wrapper-job-detail']}>{switchRenderDetail()}</div>
						</div>
					)}
				</div>
				{mode === MODE_JOB.JOB_CREATE_CREATING && (
					<div className={styles['pre-create']}>
						<div className={styles.img}>
							<Image src={Images.CREATE_JOB} priority layout="responsive" alt="Create job" />
						</div>
						<div className={styles.right}>
							<div className={styles.des}>
								<p>{translate('The new job creation process consists of four specific steps')}</p>
								<p>
									{translate(
										'Please describe in detail your requirements, so that you can find the best candidate and complete the job. Achieve the goal you set.',
									)}
								</p>
							</div>
							<button
								type="button"
								className={styles.button}
								onClick={() => {
									setEditingJob(undefined);
									setShow(true);
								}}
							>
								<i className="icon-mt-plus" />
								{translate('Create job')}
							</button>
						</div>
					</div>
				)}
			</main>
			<ModalCreateJob
				isShow={isShow}
				job={buildState}
				toggle={toggle}
				translate={translate}
				MODE={MODE}
				handleChangeTab={onClickChangeTab}
				handleOnChange={handleWhenChangeFilter}
			/>
		</>
	);
};

export default MyJob;
