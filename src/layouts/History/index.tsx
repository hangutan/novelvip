import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import { translateFunc, TranslateType } from '@utils';
import withdrawApi from '@services/withdraw';

import List from './components/List';
import Pagination from './Pagination';
import styles from './History.module.scss';

const { getWithdrawHistory } = withdrawApi;

type Props = {
	translate: TranslateType;
};

const History = (props: Props) => {
	const { translate = translateFunc } = props;
	const [parentPage, setParentPage] = useState(1);
	const [isLimit, setIsLimit] = useState(false);
	const [dataHis, setDataHis] = useState([]);

	const getHistory = async () => {
		if (isLimit) return false;

		const res = await getWithdrawHistory({ limit: 20, page: parentPage }, { setAppLoading: true });
		if (!res?.success) return false;

		setDataHis((prev) => [...prev, ...res.data]);

		if (res.data?.length === 20) {
			setParentPage((prev) => +prev + 1);
		} else {
			setIsLimit(true);
		}
	};

	const onScroll = (event) => {
		try {
			if (event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight < 1) {
				getHistory();
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getHistory();
	}, []);

	useEffect(() => {
		if (typeof document !== undefined) {
			document.body.addEventListener('scroll', onScroll);
			return () => document.body.removeEventListener('scroll', onScroll);
		}
	}, [parentPage]);

	return (
		<main className={classnames('container', styles.history)}>
			<div className={styles.history__title}>{translate('Transaction history')}</div>
			<List dataList={dataHis} translate={translate} />
			{dataHis?.length >= 20 && (
				<Pagination data={dataHis} parentPage={parentPage} setParentPage={setParentPage} stylePagination={{}} />
			)}
		</main>
	);
};

export default History;
