import React, { useEffect, useState } from 'react';
import moment from 'moment';

import List from '@components/ListItem';
import rankingService from '@services/ranking';
import { translateFunc, TranslateType } from '@utils';

import TableNavigator from '../TabNavigator';

import styles from './styles.module.scss';

moment.locale('vi');

const config = {
	name: true,
	avatar: true,
	coin: true,
	useTop: true,
	limit: 10,
	tableLimit: 10,
	fetchLimit: 10,
	fetchByPage: false,
	usePagination: false,
};

type RankingProps = {
	translate: TranslateType;
};

const Ranking = (props: RankingProps) => {
	const { translate = translateFunc } = props;
	const [tab, setTab] = useState('week');
	const [parentPage, setParentPage] = useState(1);
	const [list, setList] = useState([]);

	const listTab = [
		{ key: 'week', value: 'week', label: translate('Week'), clickable: true },
		{ key: 'month', value: 'month', label: translate('Month'), clickable: true },
		{ key: 'year', value: 'year', label: translate('Year'), clickable: true },
		{ key: 'friend', value: 'friend', label: translate('Invite friends'), clickable: false },
	];

	const timeRange = {
		startWeek: moment().startOf('isoWeek').valueOf(),
		endWeek: moment().endOf('isoWeek').valueOf(),
		startMonth: moment().startOf('month').valueOf(),
		endMonth: moment().endOf('month').valueOf(),
		startYear: moment().startOf('year').valueOf(),
		endYear: moment().endOf('year').valueOf(),
	};

	const getListRanking = async () => {
		const params = {
			limit: config.fetchLimit,
			page: parentPage,
			date_start: timeRange.startWeek,
			date_end: timeRange.endWeek,
		};
		if (tab === 'month') {
			params.date_start = timeRange.startMonth;
			params.date_end = timeRange.endMonth;
		}
		if (tab === 'year') {
			params.date_start = timeRange.startYear;
			params.date_end = timeRange.endYear;
		}
		const response = await rankingService.coinRankingList(params, { setAppLoading: true });
		if (response?.success && response?.data) {
			const final = response?.data?.map((item) => {
				item.coin = item.total_price;
				item.name = item?.user?.name;
				item.avatar = item?.user?.avatar;
				return item;
			});
			setList(final || []);
		}
	};

	useEffect(() => {
		getListRanking();
	}, [parentPage]);

	useEffect(() => {
		setParentPage(1);
		getListRanking();
	}, [tab]);

	const styleRankingList = {
		background: '#F3F0FA',
		boxShadow: '0 0 2px rgb(3 3 3 / 40%)',
	};
	const styleRankingItem = {
		background: '#FFFFFF',
	};
	return (
		<div className={styles.ranking}>
			<TableNavigator tab={tab} listTab={listTab} setTab={setTab} />
			<List
				config={config}
				originalData={list}
				parentPage={parentPage}
				styleList={styleRankingList}
				styleItem={styleRankingItem}
				setParentPage={setParentPage}
			/>
		</div>
	);
};

export default Ranking;
