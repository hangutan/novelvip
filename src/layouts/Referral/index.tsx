import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

import { appConfigs } from '@constants';
import { copyTextToClipboard, formatNumber, translateFunc, TranslateType } from '@utils';
import toast from '@utils/toastr';
import RefService from '@services/referral';
import { RootState } from '@store/rootReducer';

import styles from './Table.module.scss';
import ListReferral from './components/ListReferral';

type ReferralProps = {
	translate: TranslateType;
};

const ReferralLayout = (props: ReferralProps) => {
	const { translate = translateFunc } = props;

	// const onClickCopyCode = (text) => {
	// 	const result = copyTextToClipboard(text);
	// 	if (!text) {
	// 		toast.error(`${translate('Information does not exist')}!`);
	// 		return;
	// 	}
	// 	if (result) toast.success(`${translate('Copied referral code')}: ${text}`);
	// 	else toast.error(translate('Copy failed'));
	// };

	const onClickCopyLink = (text) => {
		const link = `${appConfigs.DOMAIN_HOST}/account/login?referral=${text}`;
		const result = copyTextToClipboard(link);
		if (!link) {
			toast.error(`${translate('Information does not exist')}!`);
			return;
		}
		if (result) toast.success(`${translate('Copied referral link')}: ${link}`);
		else toast.error(translate('Copy failed'));
	};

	const username = useSelector((state: RootState) => state?.User?.userInfo?.username || '');
	const [stats, setStats] = useState({
		total_user: 0,
		total_money: 0,
	});
	const getStats = async () => {
		const response = await RefService.referralStats();
		if (response?.success) {
			setStats(
				response?.data || {
					total_user: 0,
					total_money: 0,
				},
			);
		}
	};
	useEffect(() => {
		getStats();
	}, []);
	return (
		<div className={styles.referral}>
			<div className="container m-auto xl:flex px-5">
				<div className="xl:w-3/5">
					<div className={styles.referral__blLinkRef}>
						<div className={styles['referral__blLinkR=ef-title']}>Mời bạn bè cùng kiếm tiền</div>
						<div className={styles['referral__blLinkRef-blInput']}>
							<input
								className={styles['referral__blLinkRef-blInput-input']}
								value={`${appConfigs.DOMAIN_HOST}/account/login?referral=${username}`}
							/>
							<button type="button" className={styles['referral__blLinkRef-blInput-button']}>
								<div>
									<i
										className={classnames(
											'icon-mt-copy',
											styles['referral__blLinkRef-blInput-icon'],
										)}
									/>
								</div>
								<span aria-hidden onClick={() => onClickCopyLink(username)}>
									Copy
								</span>
							</button>
						</div>
					</div>
					<div className={styles.referral__blTotalRef}>
						<div className={styles['referral__blTotalRef-blFriend']}>
							<div className={styles['referral__blTotalRef-title']}>Tổng số bạn mời</div>
							<div className={styles['referral__blTotalRef-content']}>
								{formatNumber(stats?.total_user)} {translate('member')}
							</div>
						</div>
						<div className={styles['referral__blTotalRef-blCoin']}>
							<div className={styles['referral__blTotalRef-title']}>Số coin nhận được</div>
							<div className={styles['referral__blTotalRef-content']}>
								{formatNumber(stats?.total_money)} {appConfigs.CURRENCY}
							</div>
						</div>
					</div>
				</div>
				<div className="xl:w-2/5">
					<div className={styles.referral__list}>
						<ListReferral />
					</div>
				</div>
			</div>
		</div>
	);
};
export default ReferralLayout;
