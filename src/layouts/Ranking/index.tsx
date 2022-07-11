import React, { useEffect, useState } from 'react';
import moment from 'moment';

import TableComponent from '@components/Table';
import rankingService from '@services/ranking';
import TableNavigator from '@layouts/Ranking/components/TableNavigator';

import styles from './styles.module.scss';

moment.locale('vi');

type RakingProps = {
	translate: (string: string, object?: { text: string | void }) => string;
};

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

const Ranking = (props: RakingProps) => {
	const { translate } = props;

	const [tab, setTab] = useState('week');
	const [parentPage, setParentPage] = useState(1);
	const [list, setList] = useState([]);
	const timeRange = {
		startWeek: moment().startOf('isoWeek').valueOf(),
		endWeek: moment().endOf('isoWeek').valueOf(),
		startMonth: moment().startOf('month').valueOf(),
		endMonth: moment().endOf('month').valueOf(),
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
		const response = await rankingService.coinRankingList(params, { setAppLoading: true });
		if (response?.success && response?.data) {
			const final = response?.data?.map((item) => {
				item.coin = item.total_price;
				return item;
			});
			setList(final || []);
		}
	};
	useEffect(() => {
		getListRanking();
	}, [tab, parentPage]);
	return (
		<div className={tab === 'week' ? styles['wrapper-week'] : styles['wrapper-month']}>
			<div className="container m-auto pt-7 xl:pt-12">
				<div className="p-4 xl:w-1/2">
					<TableNavigator tab={tab} setTab={setTab} translate={translate} />
					<TableComponent
						parentPage={parentPage}
						setParentPage={setParentPage}
						originalData={list}
						tableTitle={tab === 'week' ? translate('WEEKLY RANKING') : translate('MONTHLY RANKING')}
						config={config}
					/>
				</div>
			</div>
		</div>
	);
};

export default Ranking;
