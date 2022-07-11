import { useMemo } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { Collapse } from 'antd';

import jobService from '@services/jobs';
import Button from '@components/Button';
import { formatNumber, getSafely, translateFunc } from '@utils';
import Images from '@constants/image';
import { GENDERS, appConfigs } from '@constants';
import toastr from '@utils/toastr';
import Swal from '@utils/swal';
import { RootState } from '@store/rootReducer';

import styles from './styles.module.scss';

const { Panel } = Collapse;

type JobDetailProps = {
	active: boolean;
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
	description: string;
	count_is_run: number;
	callback?: (params) => void;
	translate?: (str: string, obj?: { text: string; ns?: string }) => string;
};

const JobDetailFull = (props: JobDetailProps) => {
	const {
		active = false,
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
		date_start: startDate,
		date_end: endDate,
		description,
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
			gender:
				getSafely(() => GENDERS.filter((item) => genderIds.includes(+item?.id))) || translate('Not required'),
			area: getSafely(() => locations.filter((item) => areaIds.includes(+item?.id))) || translate('Not required'),
			education:
				getSafely(() => educations.filter((item) => educationIds.includes(+item?.id))) ||
				translate('Not required'),
			career:
				getSafely(() => careers.filter((item) => careerIds.includes(+item?.id))) || translate('Not required'),
			age:
				getSafely(
					() =>
						ageIds &&
						`${translate('From')} ${ageIds?.from} ${translate('to')} ${ageIds?.to} ${translate(
							'years old',
						)}`,
				) || translate('Not required'),
		}),
		[genderIds, areaIds, locations, educationIds, educations, careerIds, careers, ageIds, translate],
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

	const cancelJob = async () => {
		const confirm = await Swal({
			icon: 'error',
			title: translate('Confirm job cancel'),
			html: `${translate('Are you sure you want to cancel this job <b>{{text}}</b>', { text: title })}?`,
			cancelButton: translate('No'),
			confirmButton: translate('Yes'),
		});
		console.log(confirm);
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

	return (
		<div className={classnames(styles['wrapper-detail'], active && styles.active)}>
			<div className={styles['job-detail']}>
				<div className={styles['job-detail__detail']}>
					<div className={styles['job-detail__detail-avatar']}>
						<Image
							src={author?.avatar || Images.AVATAR_USER}
							width={190}
							height={190}
							alt={author?.name || translate('Anonymous')}
						/>
					</div>
					<h2 className={styles['job-detail__detail-title']}>{title}</h2>
					<div className={styles['job-detail__detail-user']}>
						<i className="icon-mt-person" />
						<div>
							<b>{author?.name || translate('Anonymous')}</b>
							<br />
							<span>
								{translate('Joined')}{' '}
								{moment(author?.created_at || '2012-01-01T09:04:07.000000Z')
									.locale(language)
									.fromNow()}
							</span>
						</div>
					</div>
					<div className={styles['job-detail__detail-info']}>
						<span style={{ display: service?.name ? 'block' : 'none' }}>
							{translate('Service')}: <span className="font-bold">{service?.name}</span>
						</span>
						<span style={{ display: provider?.name ? 'block' : 'none' }}>
							{translate('Platform')}: <span className="font-bold">{provider?.name}</span>
						</span>
						<span>
							{translate('Quantity')}:{' '}
							<span className="font-bold">
								{quantity - countIsRun}/{quantity}
							</span>
						</span>
					</div>
					<div className={styles['job-detail__detail-highlight']}>
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
							<span className="font-bold">
								{moment.unix(endDate as unknown as number).format('DD/MM/YYYY')}
							</span>
						</div>
						<div>
							<i className="icon-mt-dollar-sign" />
							<span>{translate('Price')}: </span>
							<span className="font-bold" style={{ color: '#7815ff' }}>
								{formatNumber(price)} {appConfigs.CURRENCY}
							</span>
						</div>
					</div>
					{!active && (
						<div className={styles['job-detail__detail-action']}>
							<Button
								icon={<i className="icon-mt-trash" />}
								title={translate('Cancel job')}
								className={styles['job-detail__detail-button']}
								onClick={cancelJob}
							/>
						</div>
					)}
				</div>

				<Collapse activeKey={active ? null : 1} ghost className={styles['job-detail__collapse']}>
					<Panel header={null} key="1">
						<>
							<div className={styles['job-detail__des']}>
								<div className={styles['job-detail__des-des']}>
									<p className="font-bold mb-1">{translate('Job description')}:</p>
									<div>
										<pre>{description}</pre>
									</div>
								</div>
								<div className={styles['job-detail__des-tutorial']}>
									<p className="font-bold mb-1">{translate('Tutorial video')}:</p>
									<Image src={Images.TUTORIAL} layout="responsive" alt="tutorial video" />
								</div>
							</div>
							<div className={styles['job-detail__requirement']}>
								<span className="font-bold">{translate('Job requirement')}:</span>
								{Array.isArray(gender) && gender.length > 0 && (
									<div className={styles['job-detail__requirement-list']}>
										{gender.map((item) => (
											<span key={item.label} className={styles['job-detail__requirement-item']}>
												# {translate(item.label)}
											</span>
										))}
									</div>
								)}
								{Array.isArray(area) && area.length > 0 && (
									<div className={styles['job-detail__requirement-list']}>
										{area.map((item) => (
											<span key={item.name} className={styles['job-detail__requirement-item']}>
												# {translate(item.name)}
											</span>
										))}
									</div>
								)}
								{Array.isArray(education) && education.length > 0 && (
									<div className={styles['job-detail__requirement-list']}>
										{education.map((item) => (
											<span key={item.name} className={styles['job-detail__requirement-item']}>
												# {translate(item.name)}
											</span>
										))}
									</div>
								)}
								{Array.isArray(career) && career.length > 0 && (
									<div className={styles['job-detail__requirement-list']}>
										{career.map((item) => (
											<span key={item.name} className={styles['job-detail__requirement-item']}>
												# {translate(item.name)}
											</span>
										))}
									</div>
								)}
								<div className={styles['job-detail__requirement-list']}>
									<span className={styles['job-detail__requirement-item']}># {age}</span>
								</div>
							</div>
						</>
					</Panel>
				</Collapse>
			</div>
		</div>
	);
};

export default JobDetailFull;
