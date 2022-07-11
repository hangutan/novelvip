import classnames from 'classnames';
import Image from 'next/image';
import moment from 'moment';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { formatNumber, translateFunc } from '@utils';
import Images from '@constants/image';
import { RootState } from '@store/rootReducer';
import { MODE_JOB, appConfigs } from '@constants';

import styles from './styles.module.scss';

type JobItemProps = {
	mode: string;
	id: string;
	title: string;
	author: {
		name: string;
		avatar: string;
		created_at: string;
	};
	isActive: boolean;
	onClick: (params) => void;
	provider: {
		name: string;
	};
	service: {
		name: string;
	};
	quantity: number;
	price_per: number;
	price_advance: number;
	description: string;
	status: number;
	date_end: string;
	translate: (str: string, obj?: { text: string | void }) => string;
};

const JobItem = (props: JobItemProps) => {
	const {
		mode,
		id,
		title,
		author,
		isActive,
		onClick,
		provider,
		service,
		quantity,
		price_per: price,
		price_advance: priceAdvance,
		description,
		status,
		date_end: endDate,
		translate = translateFunc,
	} = props;

	const language = useSelector((state: RootState) => state?.App?.lang);

	const showPrice = useMemo(
		() =>
			[MODE_JOB.JOB_CREATE_PROCESSING, MODE_JOB.JOB_CREATE_APPROVED].includes(mode)
				? price + priceAdvance
				: price,
		[price, priceAdvance, mode],
	);

	const renderRibbon = () => {
		switch (mode) {
			case MODE_JOB.JOB_PROCESSING: {
				const now = moment().unix();
				const isExpired = +now > +endDate;

				if (!isExpired) {
					return null;
				}

				return (
					<div className={styles.ribbon}>
						<span className={styles.expired}>{translate('Expired')}</span>
					</div>
				);
			}
			case MODE_JOB.JOB_CREATE_APPROVED: {
				const isAccept = status === MODE_JOB.STATUS_CREATE_APPROVED.ACCEPT;
				const text = (isAccept && translate('Accepted')) || translate('Denied');

				return (
					<div className={styles.ribbon}>
						<span className={isAccept ? '' : styles.negative}>{text}</span>
					</div>
				);
			}
			case MODE_JOB.JOB_COMPLETED: {
				const text = translate('Pending');

				return (
					<div className={styles.ribbon}>
						<span className={styles.pending}>{text}</span>
					</div>
				);
			}
			case MODE_JOB.JOB_APPROVED: {
				const isAccept = status === MODE_JOB.STATUS_APPROVED.ACCEPT;
				const text = (isAccept && translate('Accepted')) || translate('Denied');

				return (
					<div className={styles.ribbon}>
						<span className={isAccept ? '' : styles.negative}>{text}</span>
					</div>
				);
			}
			default: {
				break;
			}
		}
	};

	return (
		<div
			key={id}
			aria-hidden
			className={classnames(
				styles['job-item'],
				isActive && styles.active,
				mode === MODE_JOB.JOB_CREATE_APPROVED &&
					status === MODE_JOB.STATUS_CREATE_APPROVED.DENY &&
					styles.denied,
				mode === MODE_JOB.JOB_APPROVED && status === MODE_JOB.STATUS_APPROVED.DENY && styles.denied,
			)}
			onClick={onClick}
		>
			{/* {renderRibbon()} */}
			<div className={styles['job-item__left']}>
				<div className={styles['job-item__user']}>
					<div className={styles['job-item__user-avatar']}>
						<Image
							src={author?.avatar || Images.AVATAR_USER}
							width={30}
							height={30}
							alt={author?.name || translate('Anonymous')}
						/>
					</div>
					<div className={styles['job-item__user-info']}>
						<div className={styles['job-item__user-name']}>{author?.name || translate('Anonymous')}</div>
						<div className={styles['job-item__user-time']}>
							{translate('Joined')} {moment(author?.created_at).locale(language).fromNow()}
						</div>
					</div>
				</div>
				<div className={styles['job-item__detail']}>
					<p style={{ display: service?.name ? 'block' : 'none' }}>
						{translate('Service')}: <span className="font-bold">{service?.name}</span>
					</p>
					<p style={{ display: provider?.name ? 'block' : 'none' }}>
						{translate('Platform')}: <span className="font-bold">{provider?.name}</span>
					</p>
					<p>
						{translate('Quantity')}: <span className="font-bold">{formatNumber(quantity)}</span>
					</p>
				</div>
				<p className={styles['job-item__detail-price']}>
					<i className="icon-mt-dollar-sign" style={{ color: '#7815ff' }} />
					<span>{translate('Price')}: </span>
					<span className="font-bold" style={{ color: '#7815ff' }}>
						{formatNumber(showPrice)} {appConfigs.CURRENCY}
					</span>
				</p>
			</div>
			<div className={styles['job-item__separate']} />
			<div className={styles['job-item__right']}>
				<h3 className="font-bold">{title}</h3>
				<p className={styles['job-item-description']}>{description}</p>
			</div>
		</div>
	);
};

export default JobItem;
