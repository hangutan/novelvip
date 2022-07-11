import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';
import 'moment/locale/vi';
import { SwitcherOutlined } from '@ant-design/icons';

import userService from '@services/user';
import { appConfigs } from '@constants';
import { formatNumber } from '@utils';
import { RootState } from '@store/rootReducer';

// Styles
import styles from './UserLog.module.scss';

type UserProps = {
	translate: (string: string, object?: { text: string | void }) => string;
};

const UserLog = (props: UserProps) => {
	const { translate } = props;
	const [listUserLog, setListUserLog] = useState([]);

	const language = useSelector((state: RootState) => state?.App?.lang);

	const page = useRef(1) as { current: number | boolean };

	const getListUserLog = async () => {
		if (!page.current) return false;

		const params = {
			limit: 20,
			page: page.current,
		};
		const fetchUserLog = await userService.getUserLog(params, { setAppLoading: true });

		if (!fetchUserLog.success) return false;

		setListUserLog((prev) => [...prev, ...fetchUserLog.data]);
		if (fetchUserLog.data?.length === 20) {
			(page.current as number) += 1;
		} else {
			page.current = false;
		}
	};

	const onScroll = (event) => {
		try {
			if (event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight < 1) {
				getListUserLog();
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (typeof document !== undefined) {
			document.body.addEventListener('scroll', onScroll);
			return () => document.body.removeEventListener('scroll', onScroll);
		}
	}, [page]);

	useEffect(() => {
		getListUserLog();
	}, []);

	return (
		<div className={styles.userlog}>
			<div className={styles.userlog__title}>{translate('Activity Log')}</div>
			<div className={styles.userlog__list} onScroll={onScroll}>
				{listUserLog?.length > 0 ? (
					listUserLog.map((item, index) => {
						const compare = +item.new_coin - +item.old_coin;
						const absCompare = formatNumber(Math.abs(compare));
						const isUp = compare > 0;

						return (
							<div className={styles.userlog__item} key={index}>
								<div className={styles['userlog__item-blTitle']}>
									<div className={styles['userlog__item-blTitle-title']}>{item.description}</div>
									<div className={styles['userlog__item-blTitle-blRight']}>
										<div className={styles['userlog__item-blTitle-blRight-text']}>
											{moment(item.created_at).locale(language).fromNow()}
										</div>
									</div>
								</div>
								<div>{item.description}</div>
								{!Number.isNaN(item.new_coin) && !Number.isNaN(item.old_coin) && (
									<div className={styles['userlog__item-balance']}>
										{`${translate('Balance changes')}:`}
										<span className={styles.startCoin}>{formatNumber(item.old_coin)}</span>
										<i className="icon-mt-chevron_right" />
										<span className={styles.endCoin}>{formatNumber(item.new_coin)}</span>
										<span className={styles['balance-changes']}>
											&#40;
											<span className={styles.amount}>
												{absCompare} {appConfigs.CURRENCY}
											</span>
											{!!compare && (
												<>
													{isUp ? (
														<i className="icon-mt-trending_up text-green-500" />
													) : (
														<i className="icon-mt-trending_down text-red-500" />
													)}
												</>
											)}
											&#41;
										</span>
									</div>
								)}
							</div>
						);
					})
				) : (
					<div className={classnames(styles.userlog__empty)}>
						<SwitcherOutlined />
						{translate('Activity log is empty')}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserLog;
