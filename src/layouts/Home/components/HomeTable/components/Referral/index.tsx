import React, { useEffect, useState } from 'react';

import withdrawService from '@services/withdraw';
import List from '@components/ListItem';
import { translateFunc, TranslateType } from '@utils';

import TableNavigator from '../TabNavigator';

import styles from './styles.module.scss';

const config = {
	limit: 10,
	tableLimit: 10,
	fetchLimit: 10,
};

type ReferralProps = {
	translate: TranslateType;
};

const Referral = (props: ReferralProps) => {
	const { translate = translateFunc } = props;
	const [tab, setTab] = useState('withdraw');
	const [parentPage, setParentPage] = useState(1);
	const [list, setList] = useState([]);

	const listTab = [
		{ key: 'withdraw', value: 'withdraw', label: translate('List of nearest withdrawals'), clickable: false },
	];

	const getListReferral = async () => {
		const params = {
			limit: config.fetchLimit,
			page: parentPage,
			type: 'withdraw',
		};
		const response = await withdrawService.getListWithdraw(params, { name: 'withdraw' });
		if (response?.data) {
			const final = response?.data?.map((item) => ({
				...item,
				name: item?.user?.name,
				avatar: item?.user?.avatar,
			}));
			setList(final || []);
		}
	};

	useEffect(() => {
		getListReferral();
	}, [parentPage]);

	useEffect(() => {
		setParentPage(1);
		getListReferral();
	}, [tab]);

	const styleRankingList = {
		background: '#fff',
		border: '1px solid #963B99',
	};
	const styleRankingItem = {
		background: '#F3F0FA',
	};
	const stylePagination = {
		backgroundColor: '#F3F0FA',
	};
	return (
		<div className={styles.referral}>
			<TableNavigator tab={tab} listTab={listTab} setTab={setTab} />
			<List
				isTime
				originalData={list}
				parentPage={parentPage}
				setParentPage={setParentPage}
				styleList={styleRankingList}
				styleItem={styleRankingItem}
				stylePagination={stylePagination}
			/>
		</div>
	);
};

export default Referral;
