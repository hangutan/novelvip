/* eslint-disable indent */
import { useMemo } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import jobService from '@services/jobs';
import Button from '@components/Button';
import { formatNumber, getSafely, translateFunc } from '@utils';
import Images from '@constants/image';
import { MODE_JOB, GENDERS, appConfigs } from '@constants';
import toastr from '@utils/toastr';
import Swal from '@utils/swal';
import { RootState } from '@store/rootReducer';

import 'moment/locale/vi';
import styles from './styles.module.scss';

type JobDetailProps = {
	isActive: boolean;
	mode: string;
	id: string;
	job_id: string;
	title: string;
	author: {
		name: string;
		avatar: string;
		created_at: string;
	};
	provider_id: string;
	provider_service_id: string;
	package_id: string;
	gender: number[] | null;
	area: number[] | null;
	education: number[] | null;
	career: number[] | null;
	age: {
		from: number;
		to: number;
	} | null;
	date_start: string;
	date_end: string;
	quantity: number;
	price_per: number;
	price_advance: number;
	description: string;
	reason: string;
	count_is_run: number;
	status: number;
	callback?: (params) => void;
	translate?: (str: string, obj?: { text: string | void }) => string;
};

const JobDetail = (props: JobDetailProps) => {
	const router = useRouter();
	const {
		isActive,
		mode,
		id,
		job_id: jobId,
		title,
		author,
		provider_id: providerId,
		provider_service_id: serviceId,
		package_id: packageId,
		gender: genderIds,
		area: areaIds,
		education: educationIds,
		career: careerIds,
		age: ageIds,
		quantity,
		price_per: price,
		price_advance: priceAdvance,
		date_start: startDate,
		date_end: endDate,
		description,
		reason,
		status,
		count_is_run: countIsRun,
		callback,
		translate = translateFunc,
	} = props;

	const providers = useSelector((state: RootState) => state?.App?.providers || []);
	const locations = useSelector((state: RootState) => state?.App?.locations || []);
	const educations = useSelector((state: RootState) => state?.App?.educations || []);
	const careers = useSelector((state: RootState) => state?.App?.careers || []);
	const language = useSelector((state: RootState) => state?.App?.lang);

	const { gender, area, education, career, age } = useMemo(
		() => ({
			gender: getSafely(() => GENDERS.filter((item) => genderIds.includes(+item?.id))) || null,
			area: getSafely(() => locations.filter((item) => areaIds.includes(+item?.id))) || null,
			education: getSafely(() => educations.filter((item) => educationIds.includes(+item?.id))) || null,
			career: getSafely(() => careers.filter((item) => careerIds.includes(+item?.id))) || null,
			age:
				getSafely(
					() =>
						ageIds &&
						`${translate('From')} ${ageIds?.from} ${translate('to')} ${ageIds?.to} ${translate(
							'years old',
						)}`,
				) || null,
		}),
		[genderIds, areaIds, locations, educationIds, educations, careerIds, careers, ageIds, translate],
	);

	const showPrice = useMemo(
		() =>
			[MODE_JOB.JOB_CREATE_PROCESSING, MODE_JOB.JOB_CREATE_APPROVED].includes(mode)
				? price + priceAdvance
				: price,
		[price, priceAdvance, mode],
	);

	const { provider, service } = useMemo(() => {
		const provider = getSafely(() => providers.find((item) => +item?.id === +providerId));
		const service = getSafely(() => provider.services.find((item) => +item?.id === +serviceId));
		// const _package = getSafely(() => service.packages.find((item) => +item?.id === +packageId));

		return {
			provider,
			service,
			// _package,
		};
	}, [providerId, providers, serviceId, packageId]);

	if (!id) {
		return null;
	}

	const getJob = async () => {
		const confirmJob = await jobService.confirmGetJobForUser({ job_id: id }, {});

		if (confirmJob?.success) {
			router.push(`/work-job/${id}`);
		}
	};

	const workJob = () => router.push(`/work-job/${jobId}`);

	const cancelJob = async () => {
		const confirm = await Swal({
			icon: 'error',
			title: translate('Confirm job cancel'),
			html: `${translate('Are you sure you want to cancel this job <b>{{text}}</b>', { text: title })}?`,
			cancelButton: translate('No'),
			confirmButton: translate('Yes'),
		});
		if (confirm) {
			const detailJob = await jobService.cancelYourJob({ job_id: jobId || id }, {}); // In list is jobId, but in work-job is id

			if (detailJob?.success) {
				toastr.success(translate('Cancel the job successfully'));

				if (typeof callback === 'function') {
					callback({ type: 'CANCEL_JOB', payload: id });
				}
			}
		}
	};

	const editReport = () => router.push(`/edit-report/${jobId}`);

	const editJob = () => {
		if (typeof callback === 'function') {
			callback({ type: 'EDIT_JOB', payload: id });
		}
	};

	const removeJob = async () => {
		const confirm = await Swal({
			icon: 'error',
			title: translate('Confirm job deletion'),
			html: `${translate('Are you sure you want to remove this job <b>{{text}}</b>', { text: title })}?`,
			cancelButton: translate('No'),
			confirmButton: translate('Yes'),
		});
		if (confirm) {
			const removeJob = await jobService.removeJob({ job_id: id }, { setAppLoading: true });

			if (removeJob?.success) {
				toastr.success(translate('Remove the job successfully'));

				if (typeof callback === 'function') {
					callback({ type: 'REMOVE_JOB', payload: id });
				}
			} else {
				toastr.error(translate('This job cannot be removed'));
			}
		}
	};

	const renderButton = () => {
		switch (mode) {
			case MODE_JOB.JOB_CURRENT: {
				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Receive job`}
							icon={<i className="icon-mt-assignment" />}
							title={translate('Receive job')}
							className={styles['button-work-job']}
							onClick={getJob}
						/>
					</div>
				);
			}
			case MODE_JOB.WORK_JOB: {
				if (status === MODE_JOB.STATUS_APPROVED.ACCEPT) {
					return null;
				}

				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Cancel job`}
							title={translate('Cancel job')}
							className={styles['button-cancel-job']}
							onClick={cancelJob}
						/>
					</div>
				);
			}
			case MODE_JOB.JOB_PROCESSING: {
				const now = moment().unix();
				const isExpired = +now > +endDate;

				if (isExpired) {
					return (
						<div className={styles['group-button']}>
							<Button
								key={`${mode} Cancel job`}
								icon={<i className="icon-mt-trash" />}
								title={translate('Cancel job')}
								className={styles['button-cancel-job']}
								onClick={cancelJob}
							/>
						</div>
					);
				}

				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Cancel job`}
							icon={<i className="icon-mt-trash" />}
							title={translate('Cancel job')}
							className={styles['button-cancel-job']}
							onClick={cancelJob}
						/>
						<Button
							key={`${mode} Work job`}
							icon={<i className="icon-mt-assignment_turned_in" />}
							title={translate('Work job')}
							className={styles['button-work-job']}
							onClick={workJob}
						/>
					</div>
				);
			}
			case MODE_JOB.JOB_COMPLETED: {
				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Cancel job`}
							icon={<i className="icon-mt-trash" />}
							title={translate('Cancel job')}
							className={styles['button-cancel-job']}
							onClick={cancelJob}
						/>
						<Button
							key={`${mode} Report job`}
							icon={<i className="icon-mt-send" />}
							title={translate('Report job')}
							className={styles['button-confirm-job']}
							onClick={editReport}
						/>
						<Button
							key={`${mode} Rework`}
							icon={<i className="icon-mt-assignment_turned_in" />}
							title={translate('Rework')}
							className={styles['button-work-job']}
							onClick={workJob}
						/>
					</div>
				);
			}
			case MODE_JOB.JOB_APPROVED: {
				if (status === MODE_JOB.STATUS_APPROVED.ACCEPT) {
					return (
						<div className={styles['group-button']}>
							<Button
								key={`${mode} Review report`}
								icon={<i className="icon-mt-send" />}
								title={translate('Review report')}
								className={styles['button-confirm-job']}
								onClick={editReport}
							/>
						</div>
					);
				}

				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Cancel job`}
							icon={<i className="icon-mt-trash" />}
							title={translate('Cancel job')}
							className={styles['button-cancel-job']}
							onClick={cancelJob}
						/>
						<Button
							key={`${mode} Report job`}
							icon={<i className="icon-mt-send" />}
							title={translate('Report job')}
							className={styles['button-confirm-job']}
							onClick={editReport}
						/>
						<Button
							key={`${mode} Work job`}
							icon={<i className="icon-mt-assignment_turned_in" />}
							title={translate('Work job')}
							className={styles['button-work-job']}
							onClick={workJob}
						/>
					</div>
				);
			}
			case MODE_JOB.JOB_CREATE_APPROVED: {
				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Remove job`}
							icon={<i className="icon-mt-trash" />}
							title={translate('Remove job')}
							className={styles['button-cancel-job']}
							onClick={removeJob}
						/>
						{status !== MODE_JOB.STATUS_CREATE_APPROVED.ACCEPT && (
							<Button
								key={`${mode} Edit job`}
								title={translate('Edit job')}
								icon={<i className="icon-mt-edit-2" />}
								className={styles['button-work-job']}
								onClick={editJob}
							/>
						)}
					</div>
				);
			}
			case MODE_JOB.JOB_CREATE_PROCESSING: {
				return (
					<div className={styles['group-button']}>
						<Button
							key={`${mode} Remove job`}
							icon={<i className="icon-mt-trash" />}
							title={translate('Remove job')}
							className={styles['button-cancel-job']}
							onClick={removeJob}
						/>
						<Button
							key={`${mode} Edit job`}
							icon={<i className="icon-mt-edit-2" />}
							title={translate('Edit job')}
							className={styles['button-work-job']}
							onClick={editJob}
						/>
					</div>
				);
			}

			default: {
				return null;
			}
		}
	};

	return (
		<div className={styles['job-detail']} style={{ display: isActive ? 'block' : 'none' }}>
			<div className={styles['job-detail__detail']}>
				<div className={styles['job-detail__avatar']}>
					<Image
						src={author?.avatar || Images.AVATAR_USER}
						width={70}
						height={70}
						alt={author?.name || translate('Anonymous')}
					/>
				</div>
				<div className={styles['job-detail__info']}>
					<h2 className="font-bold mb-2">{title}</h2>
					<div>
						<div className={styles['job-detail__info-user']}>
							<b>{author?.name || translate('Anonymous')}</b>
							<br />
							<span>
								{translate('Joined')}{' '}
								{moment(author?.created_at || '2012-01-01T09:04:07.000000Z')
									.locale(language)
									.fromNow()}
							</span>
						</div>
						<span style={{ display: service?.name ? 'block' : 'none' }}>
							{translate('Service')}: <span className="font-bold">{service?.name}</span>
						</span>
						<span style={{ display: provider?.name ? 'block' : 'none' }}>
							{translate('Platform')}: <span className="font-bold">{provider?.name}</span>
						</span>
						<span>
							{translate('Quantity')}:{' '}
							<span className="font-bold">
								{formatNumber(quantity - countIsRun)}/{formatNumber(quantity)}
							</span>
						</span>
					</div>
				</div>
			</div>

			<div className={styles['job-detail__highlight']}>
				<div>
					<i className="icon-mt-clock" />
					<span>{translate('Start date')}: </span>
					<span className="font-bold">
						{moment.unix(startDate as unknown as number).format('DD/MM/YYYY')}
					</span>
				</div>
				<div>
					<i className="icon-mt-clock" />
					<span>{translate('End date')}: </span>
					<span className="font-bold">{moment.unix(endDate as unknown as number).format('DD/MM/YYYY')}</span>
				</div>
				<div>
					<i className="icon-mt-dollar-sign" />
					<span>{translate('Price')}: </span>
					<span className="font-bold" style={{ color: '#7815ff' }}>
						{formatNumber(showPrice)} {appConfigs.CURRENCY}
					</span>
				</div>
			</div>

			<div className={styles['job-detail__separate']} />

			<div className={styles['job-detail__description']}>
				<span className="font-bold">{translate('Job description')}:</span>
				<div className={styles['job-detail__description-content']}>
					<pre>{description}</pre>
				</div>
			</div>
			{(!!gender || !!area || !!education || !!career || !!age) && (
				<div className={styles['job-detail__requirement']}>
					<span className="font-bold">{translate('Job requirement')}:</span>
					{!!gender && (
						<div className={styles['job-detail__requirement-list']}>
							{gender.map((item) => (
								<span key={item.label} className={styles['job-detail__requirement-item']}>
									# {translate(item.label)}
								</span>
							))}
						</div>
					)}
					{!!area && (
						<div className={styles['job-detail__requirement-list']}>
							{area.map((item) => (
								<span key={item.name} className={styles['job-detail__requirement-item']}>
									# {translate(item.name)}
								</span>
							))}
						</div>
					)}
					{!!education && (
						<div className={styles['job-detail__requirement-list']}>
							{education.map((item) => (
								<span key={item.name} className={styles['job-detail__requirement-item']}>
									# {translate(item.name)}
								</span>
							))}
						</div>
					)}
					{!!career && (
						<div className={styles['job-detail__requirement-list']}>
							{career.map((item) => (
								<span key={item.name} className={styles['job-detail__requirement-item']}>
									# {translate(item.name)}
								</span>
							))}
						</div>
					)}
					{!!age && (
						<div className={styles['job-detail__requirement-list']}>
							<span className={styles['job-detail__requirement-item']}># {age}</span>
						</div>
					)}
				</div>
			)}

			{[MODE_JOB.JOB_CREATE_APPROVED, MODE_JOB.JOB_APPROVED].includes(mode) &&
				status === MODE_JOB.STATUS_CREATE_APPROVED.DENY &&
				!!reason && (
					<div className={styles['job-detail__reason']}>
						<span className="font-bold">{translate('Reason')}:</span>
						<div
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{ __html: reason.replaceAll('&nbsp;', ' ') }}
							className={styles['job-detail__reason-content']}
						/>
					</div>
				)}

			{renderButton()}
		</div>
	);
};

export default JobDetail;
