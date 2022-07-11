// Libraries
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useRouter } from 'next/router';

import toastr from '@utils/toastr';
import { translateFunc } from '@utils';
import { MODE_JOB } from '@constants';
import Button from '@components/Button';
import JobDetailFull from '@components/JobDetailFull';
// Services
import jobService from '@services/jobs';

// Styles
import styles from './styles.module.scss';

const { TextArea } = Input;

type ReportJobProps = {
	report: {
		[key: string]: string;
	};
	translate: (str: string, obj?: { text: string | void }) => string;
};

const ReportJob = (props: ReportJobProps) => {
	const router = useRouter();
	const { jobId } = router.query;
	const [job, setJob] = useState({
		id: '',
		job_id: '',
		title: '',
		author: {
			name: '',
			avatar: '',
			created_at: '',
		},
		provider_id: '',
		provider_service_id: '',
		package_id: '',
		gender: null,
		area: null,
		education: null,
		career: null,
		age: null,
		reason: '',
		quantity: 0,
		price_per: 0,
		count_is_run: 0,
		date_start: '',
		date_end: '',
		description: '',
		status: -1,
		link: '',
		steps: [],
	});

	const { translate = translateFunc, report } = props;

	const [dataForm, setDataForm] = useState(
		report || {
			image: '',
			video: '',
			note: '',
			status: MODE_JOB.STATUS_APPROVED.ACCEPT,
		},
	);

	const getJob = async () => {
		const detailJob = await jobService.getJobDetail({ job_id: jobId }, { setAppLoading: true });

		if (detailJob?.success && detailJob?.data) {
			setJob(detailJob?.data);
		} else {
			setTimeout(() => {
				router.push('/list-job?status=completed');
			}, 2000);
		}
	};

	useEffect(() => {
		if (jobId) {
			getJob();
		}
	}, [jobId]);

	useEffect(() => {
		if (report) {
			setDataForm(report);
		}
	}, [report]);

	const onClickGoBack = () => {
		router.back();
	};

	const onChangeData = (event) => {
		setDataForm({ ...dataForm, [event.target.name]: event.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		if (!dataForm?.video && !dataForm?.image && !dataForm?.note) {
			toastr.error(translate('Please fill in the link or note'));

			return false;
		}

		const params = {
			job_id: jobId,

			link_complete: dataForm?.video,
			image_complete: dataForm?.image,
			note_complete: dataForm?.note,
		};

		const pushJob = await jobService.completeJob(params, { setAppLoading: true });

		if (pushJob?.success) {
			toastr.success(translate('Successful job reported'));

			// if (report?.status) {
			// 	router.push('/manage-job?status=approved');
			// } else {
			// 	router.push('/manage-job');
			// }

			router.push('/list-job?status=completed');
		}
	};

	return (
		<>
			<JobDetailFull active translate={translate} {...job} />
			<div className={styles.report}>
				<form className={styles.report__form}>
					<div className={styles['report__form-group']}>
						<p>{translate('Photo link completed job')}:</p>
						<Input
							className={styles['report__form-input']}
							placeholder={translate('Input photo link')}
							type="text"
							id="image"
							name="image"
							value={dataForm?.image}
							onChange={onChangeData}
							bordered={false}
							disabled={+report?.status === +MODE_JOB.STATUS_APPROVED.ACCEPT}
						/>
					</div>
					<div className={styles['report__form-group']}>
						<p>{translate('Video link completed job')}:</p>
						<Input
							className={styles['report__form-input']}
							placeholder={translate('Input video link')}
							type="text"
							id="video"
							name="video"
							value={dataForm?.video}
							onChange={onChangeData}
							bordered={false}
							disabled={+report?.status === +MODE_JOB.STATUS_APPROVED.ACCEPT}
						/>
					</div>

					<div className={styles['report__form-group']}>
						<p>{translate('Notes')}:</p>

						<TextArea
							className={styles['report__form-input']}
							placeholder={translate('Input note')}
							id="note"
							name="note"
							autoSize={{ minRows: 4, maxRows: 10 }}
							value={dataForm?.note}
							onChange={onChangeData}
							bordered={false}
							disabled={+report?.status === +MODE_JOB.STATUS_APPROVED.ACCEPT}
						/>
					</div>
				</form>

				{+report?.status !== +MODE_JOB.STATUS_APPROVED.ACCEPT && (
					<div className={styles.action}>
						<Button
							icon={<i className="icon-mt-done" />}
							title={translate('Back')}
							onClick={onClickGoBack}
							className={styles.back__button}
						/>
						<Button
							icon={<i className="icon-mt-send" />}
							title={translate('Report job')}
							onClick={onSubmit}
							className={styles.report__button}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default ReportJob;
