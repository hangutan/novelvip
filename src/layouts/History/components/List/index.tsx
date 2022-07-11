import React from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { translateFunc, TranslateType, formatNumber } from '@utils';
import Images from '@constants/image';
import { RootState } from '@store/rootReducer';

import styles from './List.module.scss';
import 'moment/locale/vi';

type ItemProps = {
	item: {
		account_name: string;
		type: string;
		payment_method: string;
		status: number;
		coin: number;
		created_at: number;
	};
	language: string;
	translate: TranslateType;
};

const Item = (props: ItemProps) => {
	const { item, language, translate = translateFunc } = props;

	const statusMapping = {
		1: { class: 'primary', label: translate('Waiting') },
		2: { class: 'success', label: translate('Success') },
		3: { class: 'reject', label: translate('Reject') },
	};

	return (
		<div className={styles.item}>
			<div className={styles.item__user}>
				<Image src={Images.AVATAR_USER} width="27" height="27" className={styles.item__avt} />
				<div className={styles.item__name}>{item?.account_name}</div>
			</div>
			<div className={styles.item__dlNone}>
				{item?.type === 'withdraw' ? translate('Withdraw') : translate('Recharge')}
			</div>
			<div className={classnames(styles.item__status, styles[statusMapping[item?.status].class])}>
				{statusMapping[item?.status].label}
			</div>
			<div>
				<span className="font-bold">{formatNumber(item?.coin)} </span>VNĐ
			</div>
			<div className={classnames(styles.w20, styles.item__dlNone)}>
				{item?.payment_method === 'bank' ? translate('From bank account') : translate('From Momo account')}
			</div>
			<div className={classnames(styles.item__textRight, styles.item__dlNone)}>
				{moment(item?.created_at).locale(language).fromNow()}
			</div>
		</div>
	);
};

type ListProps = {
	dataList?: Array<{
		id: number;
		account_name: string;
		type: string;
		payment_method: string;
		status: number;
		coin: number;
		created_at: number;
	}>;
	translate: TranslateType;
};

const List = (props: ListProps) => {
	const { dataList, translate = translateFunc } = props;

	const language = useSelector((state: RootState) => state?.App?.lang);

	return (
		<div className={styles.list}>
			{dataList?.length > 0 &&
				dataList?.map((item) => <Item key={item?.id} item={item} language={language} translate={translate} />)}
		</div>
	);
};

export default List;
