import React from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import moment from 'moment';

import 'moment/locale/vi';
import { formatNumber } from '@utils';
import Images from '@constants/image';

import styles from './styles.module.scss';

type ItemProps = {
	data: {
		avatar: string;
		name?: string;
		coin?: number | string;
		created_at?: string;
	};
	isTime?: boolean;
	useTop?: boolean;
	styleItem?: object;
	index?: number | string;
	parentPage?: number | string;
	language: 'vi' | 'en';
};

const Item = (props: ItemProps) => {
	const { styleItem, data, isTime, useTop, parentPage, index, language } = props;
	const { name, coin, avatar, created_at: created } = data;

	const currentAvt = avatar || Images.AVATAR_USER;

	const avatarClassName = () => {
		if (!useTop) return styles['list__item-avatar'];

		if (parentPage === 1) {
			switch (index) {
				case 0:
					return styles['avatar-frame-top-1'];
				case 1:
					return styles['avatar-frame-top-2'];
				case 2:
					return styles['avatar-frame-top-3'];
				default:
					return styles['avatar-frame'];
			}
		}

		return styles['avatar-frame'];
	};

	return (
		<div
			className={styles.list__item}
			style={useTop && parentPage === 1 && index < 3 ? { backgroundColor: '#fff298' } : styleItem}
		>
			<div className={avatarClassName()}>
				<div className={styles.avatar}>
					<Image src={currentAvt} width="36" height="36" className="rounded-full" alt={name} />
				</div>
			</div>
			<div className={styles.list__blRight}>
				<div className={styles['list__blRight-blText']}>
					<div className={styles['list__blRight-textName']}>{name}</div>
					{!!isTime && !!created && (
						<div className={styles['list__blRight-blTimeRight']}>
							<i className={classnames('icon-mt-clock', styles['list__blRight-blTimeRight-iconTime'])} />
							<div className={styles['list__blRight-blTimeRight-textTime']}>
								{moment(created).locale(language).fromNow()}
							</div>
						</div>
					)}
				</div>
				{!!coin && <div className={styles['list__blRight-textCoin']}>{formatNumber(coin)} VNĐ</div>}
			</div>
		</div>
	);
};

export default Item;
