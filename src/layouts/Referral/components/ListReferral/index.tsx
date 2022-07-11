import React, { useEffect, useState } from 'react';

import refService from '@services/referral';
import List from '@components/ListItem';

const config = {
	name: true,
	avatar: true,
	coin: true,
	useTop: false,
	fetchLimit: 5,
	fetchByPage: true,
};

const ListReferral = () => {
	const [list, setList] = useState([]);
	const [parentPage, setParentPage] = useState(1);

	const getList = async () => {
		const params = {
			limit: config.fetchLimit,
			page: parentPage,
		};
		const response = await refService.listReferral(params, { setAppLoading: true });
		if (response?.success) {
			const final = response?.data?.map((item) => {
				item.user = item;
				return item;
			});
			setList(final || []);
		}
	};
	useEffect(() => {
		getList();
	}, [parentPage]);

	const styleRankingList = {
		background: '#fff',
	};
	const styleRankingItem = {
		background: '#F3F0FA',
	};
	const stylePagination = {
		'background-color': '#F3F0FA',
	};

	return (
		<List
			isTime
			config={config}
			originalData={list}
			title="Danh sách đã mời"
			parentPage={parentPage}
			styleList={styleRankingList}
			styleItem={styleRankingItem}
			stylePagination={stylePagination}
			setParentPage={setParentPage}
		/>
	);
};

export default ListReferral;
