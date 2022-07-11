import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';

import jobService from '@services/jobs';
import { getSafely, copyTextToClipboard, translateFunc } from '@utils';
import { MODE_JOB } from '@constants';
import Button from '@components/Button';
import JobDetailFull from '@components/JobDetailFull';
import toastr from '@utils/toastr';

import styles from './styles.module.scss';

type WorkJobProps = {
	translate: (str: string, obj?: { text: string | void }) => string;
};

const WorkJob = (props: WorkJobProps) => {
	const router = useRouter();

	const { translate = translateFunc } = props;

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

	const [currenStep, setCurrenStep] = useState(0);

	const steps = useMemo(() => job.steps || [], [job]);

	const getJob = async () => {
		const detailJob = await jobService.getJobDetail({ job_id: jobId }, { setAppLoading: true });

		if (detailJob?.success && detailJob?.data) {
			setJob(detailJob?.data);
		} else {
			setTimeout(() => {
				router.push('/list-job');
			}, 2000);
		}
	};

	useEffect(() => {
		if (jobId) {
			getJob();
		}
	}, [jobId]);

	const onClickStartJob = () => {
		if (typeof document !== undefined) {
			document.body.scrollTo({ top: 0, behavior: 'smooth' });
		}
		setTimeout(() => {
			setCurrenStep(1);
		}, 200);
	};

	const onClickCompleteJob = () => {
		router.push(`/report-job/${jobId}`);
	};

	const callbackCancelJob = () => {
		router.push('/list-job');
	};

	const renderStep = () => {
		switch (currenStep) {
			case 0: {
				return (
					<>
						<div className={styles['wrapper-list-step']}>
							<p className={styles.title}>{translate('Steps to do')}:</p>
							<div className={styles.card__list}>
								{!!getSafely(() => job.steps.length) &&
									steps?.map((step) => (
										<div key={step?.id} className={styles.card__item}>
											<div className={styles.step}>
												<span>
													{translate('Step')} {step?.sort}
												</span>
												<i className="icon-mt-box-checked" />
											</div>
											<div className={styles.content}>
												<h3>{step?.name}</h3>
												<div
													// eslint-disable-next-line react/no-danger
													dangerouslySetInnerHTML={{
														__html: step?.description.replaceAll('&nbsp;', ' '),
													}}
												/>
												<h4>{translate('Link job')}</h4>
												<div className={styles.content__footer}>
													<span>{job?.link}</span>
													<Button
														icon={<i className="icon-mt-sticky_note" />}
														title={translate('Copy')}
														className={styles.copy}
														onClick={() => {
															const result = copyTextToClipboard(job?.link);
															if (result) {
																toastr.success(translate('Copied successfully'));
															}
														}}
													/>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
						<div className={styles.action}>
							<Button
								iconSuffix={<i className="icon-mt-chevron_right" />}
								title={translate('Start')}
								className={styles.button__start}
								onClick={onClickStartJob}
							/>
						</div>
					</>
				);
			}

			default: {
				const step = steps[currenStep - 1] || {};
				const element = document.createElement('div');
				element.innerHTML = step?.description;
				const textContent = element.textContent || element.innerText;

				return (
					<>
						<div className={styles['wrapper-step']}>
							<div className={styles['tab-step']}>
								{steps?.length &&
									steps?.map((item, index) => (
										<div
											className={classnames(
												styles['tab-pane'],
												step?.sort > index && styles.active,
											)}
										>
											<span>{item?.sort}</span>
										</div>
									))}
							</div>
							<div key={step?.id} className={styles.card__item}>
								<div className={styles.step}>
									<span>
										{translate('Step')} {step?.sort}
									</span>
									{/* <i className="icon-mt-box-empty" /> */}
								</div>
								<div className={styles.content}>
									<h3>{step?.name}</h3>
									<p>{textContent}</p>
									<h4>{translate('Link job')}</h4>
									<div>
										<span>{job?.link}</span>
										<Button
											icon={<i className="icon-mt-sticky_note" />}
											title={translate('Copy')}
											className={styles.copy}
											// onClick={() => copyTextToClipboard(job?.link)}
											onClick={() => {
												const result = copyTextToClipboard(job?.link);
												if (result) {
													toastr.success(translate('Copied successfully'));
												}
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.action}>
							<Button
								icon={<i className="icon-mt-chevron_left" />}
								className={styles.button__back}
								title={translate('Go back')}
								onClick={() => setCurrenStep((curr) => curr - 1)}
							/>

							{currenStep !== steps.length && (
								<Button
									iconSuffix={<i className="icon-mt-chevron_right" />}
									className={styles.button__continue}
									title={translate('Continue')}
									onClick={() => setCurrenStep((curr) => curr + 1)}
								/>
							)}

							{currenStep === steps.length && job?.status !== MODE_JOB.STATUS_APPROVED.ACCEPT && (
								<Button
									icon={<i className="icon-mt-send" />}
									className={styles.button__report}
									title={translate('Report job')}
									onClick={onClickCompleteJob}
								/>
							)}
						</div>
					</>
				);
			}
		}
	};

	const renderButtonCompleteJob = () =>
		job?.title &&
		job?.status !== MODE_JOB.STATUS_APPROVED.ACCEPT && (
			<div className={styles.action}>
				<Button
					icon={<i className="icon-mt-send" />}
					className={styles.button__report}
					title={translate('Report job')}
					onClick={onClickCompleteJob}
				/>
			</div>
		);

	return (
		<>
			<JobDetailFull active={currenStep !== 0} callback={callbackCancelJob} translate={translate} {...job} />
			{steps?.length ? renderStep() : renderButtonCompleteJob()}
		</>
	);
};

export default WorkJob;
